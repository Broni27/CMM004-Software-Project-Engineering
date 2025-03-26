using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//Setting up DbContext
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//Adds JWT Authentication
var tokenKey = builder.Configuration["TokenKey"];
if (string.IsNullOrEmpty(tokenKey))
{
    throw new Exception("TokenKey is missing in the config!"); 
}

var key = Encoding.UTF8.GetBytes(tokenKey);


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,    //Token expiration validation
        ValidAlgorithms = new[] {SecurityAlgorithms.HmacSha512},
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
    };
});

builder.Services.AddControllers();
builder.Services.AddAuthorization();

//Adds other services
builder.Services.AddCors();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<EventRepository>();
builder.Services.AddScoped<UserEventRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

//Enable CORS
app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin() // Accept requests from any URL
); 

//Use authentication and authorisation middleware
app.UseAuthentication(); //Needed for JWT authentication
app.UseAuthorization();

app.MapControllers();

app.Run();