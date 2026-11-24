import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollFilm } from "@/components/ScrollFilm";
import {
  getActivePromos,
  getNovinky,
  getBlogPosts,
  getPriceItems,
  getPublicSeasonCampaign,
  getReviews,
} from "@/lib/content";
import { getHomepageWorkItems } from "@/lib/cms/gallery";
import { LeadPopup } from "@/components/LeadPopup";
import { PromoStickyNote } from "@/components/PromoStickyNote";

export default async function HomePage() {
  const [priceItems, reviews, blogPosts, workItems, promos, season, novinky] =
    await Promise.all([
      getPriceItems(),
      getReviews(),
      getBlogPosts(),
      getHomepageWorkItems(),
      getActivePromos(),
      getPublicSeasonCampaign(),
      getNovinky(),
    ]);

  const featuredPromo = promos[0] ?? null;

  return (
    <SmoothScroll>
      <ScrollFilm
        priceItems={priceItems}
        reviews={reviews}
        blogPosts={blogPosts}
        workItems={workItems}
        promos={promos}
        season={season}
      />
      {featuredPromo ? <PromoStickyNote promo={featuredPromo} /> : null}
      {novinky.leadPopupApproved ? (
        <LeadPopup config={novinky.leadPopup} />
      ) : null}
    </SmoothScroll>
  );
}
