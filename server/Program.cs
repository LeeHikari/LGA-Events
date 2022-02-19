using services;

bool usingCloud = false;

if (args.Length > 0)
{
    usingCloud = args.Any(arg => arg == "--cloud");
}

Scraper scraper = new Scraper(usingCloud);
scraper.Scrape().Wait();