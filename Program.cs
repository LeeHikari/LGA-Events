﻿using System.Text.Json;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;

Scraper.Scrape().Wait();

class Website
{
    private string? Title { get; set; }
    private string? Url { get; set; }
    public string? UrlLink { get; set; }
    private string? ImageUrl { get; set; }

    //public string[] ImageQueryTerms { get; } = { "image-block" };
}

public class Scraper
{
    public static async Task Scrape()
    {
        try
        {
            Website website = new Website { UrlLink = "https://atparramatta.com/whats-on" };

            CancellationTokenSource cancellationToken = new CancellationTokenSource();
            HttpClient httpClient = new HttpClient();
            
            HttpResponseMessage request = await httpClient.GetAsync(website.UrlLink);
            cancellationToken.Token.ThrowIfCancellationRequested();

            Stream response = await request.Content.ReadAsStreamAsync();
            cancellationToken.Token.ThrowIfCancellationRequested();
            
            HtmlParser parser = new HtmlParser();
            IHtmlDocument document = parser.ParseDocument(response);

            GetScrapeResults(document);
            
        }
        catch(HttpRequestException e)
        {
            Console.WriteLine("\nException Caught!");	
            Console.WriteLine("Message :{0} ",e.Message);
        }

    }

    public static async Task GetScrapeResults(IHtmlDocument document)
    {
        Website website = new Website { UrlLink = "https://atparramatta.com/whats-on" };

        var urlLink = new List<string>();

        urlLink = document.All
            .Where(x =>
                x.ClassName == "title" &&
                x.TextContent != null && x.TagName == "H4")
            .Select(x => x.TextContent)
            .ToList();

        if (urlLink.Count == 0)
        {
            Console.WriteLine("Nothin!");
        } 
        else 
        {
            foreach(var title in urlLink)
            {
                Console.WriteLine(title);
            }
        }
        Console.WriteLine($"Current directory is '{Environment.CurrentDirectory}'");

        await ExportToJson();
    }

    public static async Task ExportToJson()
    {
        Website website = new Website();

        string fileName = "EventInfo.json";
        using FileStream createStream = File.Create(fileName);

        var options = new JsonSerializerOptions { WriteIndented = true };

        await JsonSerializer.SerializeAsync(createStream, options);
        await createStream.DisposeAsync();


        //string projectFolder = System.IO.Path.GetFullPath(@"..\..\");
        //File.WriteAllText( @"webscrapertool\eventInfo.json", jsonFile);
        //using (StreamWriter file = File.CreateText())
    }
}
