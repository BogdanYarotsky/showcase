using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();

builder.Services.AddSingleton<DateTimeNowFunc>(() => DateTime.Now);
builder.Services.AddScoped<WeatherForecastHandler>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(gen =>
{
    gen.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hello",
        Description = "World",
        Version = "1"
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.MapGet("/weatherforecast", (WeatherForecastHandler h) => h.GetWeatherForecast())
.WithName("GetWeatherForecast")
.WithTags("Weather")
.WithOpenApi();

app.Run();


delegate DateTime DateTimeNowFunc();

class WeatherForecastHandler
{
    private readonly DateTimeNowFunc _dateTimeNowFunc;

    public WeatherForecastHandler(DateTimeNowFunc dateTimeNowFunc)
    {
        _dateTimeNowFunc = dateTimeNowFunc;
    }

    public WeatherForecast[]? GetWeatherForecast()
    {
        var summaries = new[] {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        var now = _dateTimeNowFunc();
        var forecast = Enumerable.Range(1, 5).Select(i =>
            new WeatherForecast
            (
                DateOnly.FromDateTime(now.AddDays(i)),
                Random.Shared.Next(-20, 55),
                summaries[Random.Shared.Next(summaries.Length)]
            ))
        .ToArray();
        return forecast;
    }
}

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
