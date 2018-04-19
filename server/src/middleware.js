import jwt from 'jsonwebtoken'

// import { Meteor } from 'meteor/meteor'

export async function context(headers) {
	const authorization = headers['authorization']

	// console.log(authorization)

	const user = await getUser(authorization)

	return {
		user,
	}
}

const pubKey = `-----BEGIN CERTIFICATE-----
MIIC/TCCAeWgAwIBAgIJLeXORw/pw//IMA0GCSqGSIb3DQEBCwUAMBwxGjAYBgNV
BAMTEW5vbmUuZXUuYXV0aDAuY29tMB4XDTE3MDQwNjA4MTIxN1oXDTMwMTIxNDA4
MTIxN1owHDEaMBgGA1UEAxMRbm9uZS5ldS5hdXRoMC5jb20wggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQCzDX0O2RJldlJEUgtck6FlOTZJHmYzezLyeJuK
M9fR0HfkuwVYmYBFa/rElrfx7KX+BKcPe9LCEaGAA6RoxkPyBZ2ODYVbVqEvhvHI
37sE33+G16wiYc76KXKVSdqFw5sTYFp71sxH2ezKge7viLq/H5BpTZbZMm/tT9n5
3QLPbexyZ3BNSt5pqdsBjR3x/J3+37oie9PVXaKetgCBRaRAIqBb0L6aL6ctRuOb
R3qbi6b/I5PEMiLDoW5+f9azys538soT5hr5InKykVeozy94KWpkzUcGSB0vPJeP
yQMQln42haYbVwVHpBhJmmNGS3fBfxBkPY3bvmjfZQDp/hDbAgMBAAGjQjBAMA8G
A1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFPXK5lNHJrLCZSwZBXd/Cxm5N+PJMA4G
A1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEABrmkp4d6DcKtHBGqZtgp
0eK3FLaLUneJsbDggIUaPZL4YtF0neXSBO0vK3hk/32lxY6xizjXJ/2IsoaeKK0V
wnwZDliWPR0TtV0YWoAMoHGriePam8+rjKNga5yGPlngCrGKt6STtFSqIU+ZRSiS
R87hqC+cMok7cD4rlnrhS7/Tk6GZ+6jV85u4MHoXW73Z6mjUThuwPIpI/nts23GS
ZbXA9Xz9TC23+OTn2vwW4N2QGmlGp3uL7sFvLlU+Hf5/oLItNa/SMXxGlQQKYHgd
fvYkIzFFcJLlaBndr/jRNnbgY0bGRW1XCB7f900VqTONSpgJGsjs1vCD/iohiNl1
CQ==
-----END CERTIFICATE-----`

async function getUser(authorization) {
	const bearerLength = 'Bearer '.length

	if (authorization && authorization.length > bearerLength) {
		const token = authorization.slice(bearerLength)
		// const pubKey = Meteor.settings.private.auth0PubKey

		// console.log(token)
		// console.log(pubKey)

		const { ok, result } = await new Promise(resolve =>
			jwt.verify(token, pubKey, { algorithm: 'RS256' }, (err, result) => {
				if (err) {
					resolve({
						ok: false,
						result: err,
					})
				} else {
					resolve({
						ok: true,
						result,
					})
				}
			})
		)

		if (ok) {
			return {
				...result,
			}
		} else {
			console.error(result)
			// return null
		}
	}

	return null
}
