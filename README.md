# Setting up aws-cli

```shell
aws configure
```
Zone: eu-central-1

# Bucket creation

## Enable static website hosting

`Bucket` > `Permissions` > `Static website hosting`

## Allow read access
Set permissions to allow all under `Bucket` > `Permissions`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::cat-sitting/*"
        }
    ]
}
```

# Building and deploying

```shell
mdbook build
aws s3 sync book s3://cat-sitting/book --size-only
```
