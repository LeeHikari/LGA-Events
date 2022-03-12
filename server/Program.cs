using services;

bool usingCloud = false;

//Creates an argument for sending JSON file to Google Cloud
if (args.Length > 0)
{
    usingCloud = args.Any(arg => arg == "--cloud");
}

Scraper scraper = new Scraper(usingCloud);
scraper.Scrape().Wait();