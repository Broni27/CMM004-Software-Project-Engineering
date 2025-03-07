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

    public string CreateToken(User user) 
    {
        //Retrieves TokenKey from APi/bin.appsettings.json
        var secretKey = _config["TokenKey"];
        if (secretKey == null) throw new Exception("Cannot get the tokenkey!");
        
        //Creates security key using token key
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        //Define claims for JWT token
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),       //Stores user Id in the token (used to find user)
            new Claim(ClaimTypes.Email, user.Email)                         //Email (since login is email-based)
        };

        //Defines signing credentials using HmacSha512 algorithm
        var cred = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha512);

        //Define token descriptor
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),       //Adds claims to token
            Expires = DateTime.UtcNow.AddDays(7),       //Sets token expiration (7 days)
            SigningCredentials = cred                   //Adds singing credentials  
        };
        
        //Creates token handler and generates token
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        //Returns token as a string
        return tokenHandler.WriteToken(token);
    }
}