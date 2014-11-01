# www.lightspeedworks.com on node-ninja.com

## インストール

    # su - node
    $ nvm ls
    $ nvm install v0.11.10

## .bashrc

    $ vi .bashrc

以下を追加

    NODE_VERSION=v0.11.10

最後に以下を追加

    node -p '["node", process.version, process.arch, process.platform].join(" ")'
    export TZ=Asia/Tokyo

## 設定ファイルを追加

    $ cd node-service/releases/
    $ cat > LightSpeedWorks.json
    {
      セキュリティ上保護されている共通の設定...
    }
    $

## セットアップ

ワンクリックインストール

## オートシンク

オートシンク設定

以上
