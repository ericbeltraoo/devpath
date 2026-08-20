-- ===========================================================================
-- DevPath — schema MySQL
-- ===========================================================================
-- Rode uma vez, conectado ao MySQL da VPS:
--   mysql -u root -p < schema.sql
--
-- Diferenca importante em relacao ao Postgres: o MySQL nao tem Row Level
-- Security. La o banco garantia o isolamento entre usuarios sozinho; aqui
-- quem garante e a API — toda consulta filtra por usuario_id vindo do JWT,
-- nunca de parametro da requisicao. Isso esta comentado em cada rota.
-- ===========================================================================

CREATE DATABASE IF NOT EXISTS devpath
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE devpath;

-- ---------------------------------------------------------------------------
-- Usuarios
-- ---------------------------------------------------------------------------
-- senha_hash guarda bcrypt, nunca a senha. 60 caracteres e o tamanho fixo
-- do hash bcrypt — o VARCHAR(72) deixa margem para mudanca de algoritmo.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255)  NOT NULL,
  senha_hash    VARCHAR(72)   NOT NULL,
  nome          VARCHAR(120)  NULL,
  criado_em     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_login  TIMESTAMP     NULL,
  ativo         TINYINT(1)    NOT NULL DEFAULT 1,

  UNIQUE KEY uk_usuarios_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Progresso
-- ---------------------------------------------------------------------------
-- Uma linha por usuario, com o estado inteiro do app em JSON. Mesma decisao
-- que foi tomada no Postgres: o formato do progresso muda toda vez que um
-- modulo novo entra no roadmap, e assim nao existe migration a cada mudanca
-- de conteudo.
--
-- MySQL 5.7+ tem tipo JSON nativo com validacao. Em versao anterior, troque
-- por LONGTEXT — a API funciona igual.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS progresso (
  usuario_id      BIGINT UNSIGNED PRIMARY KEY,
  dados           JSON         NOT NULL,
  atualizado_em   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_em       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Contador de gravacoes por minuto, para o limite de taxa (ver api.js).
  janela_inicio   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  janela_escritas INT UNSIGNED NOT NULL DEFAULT 0,

  CONSTRAINT fk_progresso_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Refresh tokens
-- ---------------------------------------------------------------------------
-- Guardamos o HASH do token, nunca o token. Se o banco vazar, os refresh
-- tokens continuam inuteis para o atacante.
--
-- revogado_em permite logout de verdade: sem isso, um JWT roubado vale ate
-- expirar e nao ha nada a fazer.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  BIGINT UNSIGNED NOT NULL,
  token_hash  CHAR(64)        NOT NULL,      -- sha256 em hex
  expira_em   TIMESTAMP       NOT NULL,
  revogado_em TIMESTAMP       NULL,
  criado_em   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uk_refresh_hash (token_hash),
  KEY idx_refresh_usuario (usuario_id, revogado_em),

  CONSTRAINT fk_refresh_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Tentativas de login
-- ---------------------------------------------------------------------------
-- Limite de taxa no SERVIDOR. O backoff que existe na tela do app e so
-- usabilidade: um atacante chama a API direto e ignora o front. Esta tabela
-- e o que realmente barra forca bruta.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tentativas_login (
  id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email     VARCHAR(255) NOT NULL,
  ip        VARCHAR(45)  NOT NULL,           -- 45 cobre IPv6
  sucesso   TINYINT(1)   NOT NULL,
  em        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_tentativas_email (email, em),
  KEY idx_tentativas_ip (ip, em)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Limpeza
-- ---------------------------------------------------------------------------
-- Sem isso as duas tabelas de controle crescem para sempre. Se o event
-- scheduler estiver desligado, a API tambem limpa sozinha (ver api.js).
-- ---------------------------------------------------------------------------
SET GLOBAL event_scheduler = ON;

DROP EVENT IF EXISTS limpar_dados_efemeros;
CREATE EVENT limpar_dados_efemeros
  ON SCHEDULE EVERY 1 DAY
  DO
    BEGIN
      DELETE FROM tentativas_login WHERE em < NOW() - INTERVAL 30 DAY;
      DELETE FROM refresh_tokens
        WHERE expira_em < NOW() - INTERVAL 7 DAY
           OR (revogado_em IS NOT NULL AND revogado_em < NOW() - INTERVAL 7 DAY);
    END;

-- ---------------------------------------------------------------------------
-- Usuario da aplicacao
-- ---------------------------------------------------------------------------
-- A API NAO deve conectar como root. Troque a senha antes de rodar.
-- Repare que nao ha GRANT de DROP nem de ALTER: se a API for comprometida,
-- o atacante nao consegue destruir o schema.
-- ---------------------------------------------------------------------------
CREATE USER IF NOT EXISTS 'devpath_app'@'localhost'
  IDENTIFIED BY 'TROQUE_ESTA_SENHA';

GRANT SELECT, INSERT, UPDATE, DELETE ON devpath.* TO 'devpath_app'@'localhost';
FLUSH PRIVILEGES;

-- ---------------------------------------------------------------------------
-- Conferencia
-- ---------------------------------------------------------------------------
-- SHOW TABLES FROM devpath;
-- SHOW GRANTS FOR 'devpath_app'@'localhost';
