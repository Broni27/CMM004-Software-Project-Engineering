using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.CodeAnalysis;
using Microsoft.IdentityModel.Tokens;
using API.models;

namespace API.Services;

public class TokenService
{
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config) {
        _config = config;
    }

    public string CreateToken(User user) {
        var secretKey = _config["TokenKey"];
        if (secretKey == null) throw new Exception("Cannot get the tokenkey!");
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Username)
        };
        var cred = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = cred
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);

    }


}
