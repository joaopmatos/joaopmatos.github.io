import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "css/style.css": "css/style.css" });
  eleventyConfig.addPassthroughCopy(".nojekyll");

  eleventyConfig.addPlugin(pluginRss);

  // Root-relative URLs survive the user-site (/) topology unchanged.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Repo docs and scaffolding are not pages.
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("_templates/");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("readableDate", (dateObj) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(dateObj),
  );

  eleventyConfig.addFilter("isoDate", (dateObj) =>
    dateObj.toISOString().slice(0, 10),
  );

  // Home page shows the three most recent posts.
  eleventyConfig.addFilter("limit", (items, count) => items.slice(0, count));

  eleventyConfig.addCollection("postsByDate", (collection) =>
    [...collection.getFilteredByGlob("posts/*.md")]
      .filter((post) => !post.data.draft)
      .sort((a, b) => b.date - a.date),
  );

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
