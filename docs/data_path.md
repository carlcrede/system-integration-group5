# How to send products.db via FTP

You'll be sending the file over SFTP using the provided key file. Run the following command to the SFTP server.
```
sftp -i <key_file> keablob.keasi@keablob.blob.core.windows.net`
```
Then upload the file using the put command
```
sfpt> put <db_file>
```

It is possible to do this in one line of code
```
sftp -i <key_file> keablob.keasi@keablob.blob.core.windows.net:/ <<< $'put <db_file>'
```