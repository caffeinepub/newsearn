import type { Article } from "../backend.d";

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: BigInt(1),
    title:
      "India's GDP Grows 7.2% in Q3: Experts Optimistic About Full-Year Outlook",
    summary:
      "India's economy expanded at a robust 7.2% in the third quarter, buoyed by strong manufacturing output and record service sector growth.",
    content: `India's gross domestic product (GDP) grew by an impressive 7.2% in the third quarter of the fiscal year, exceeding analysts' expectations of 6.8% growth. The robust performance was driven by strong manufacturing output, resilient consumer spending, and a record-breaking service sector.\n\nThe Ministry of Finance released the data on Wednesday, attributing the growth to structural reforms implemented over the past two years, increased foreign direct investment, and a surge in infrastructure spending.\n\n"This is a testament to India's economic resilience," said Dr. Ananya Sharma, chief economist at the National Institute of Public Finance. "We're seeing broad-based growth across sectors, which is exactly what we need for sustainable development."\n\nThe manufacturing sector grew 8.1%, led by automotive, pharmaceuticals, and electronics. The services sector expanded 7.8%, with IT exports and financial services leading the charge. Agriculture, which employs about half the workforce, grew 4.2%, helped by a good monsoon season.\n\nExperts now project full-year GDP growth of 7.0%-7.5%, which would make India the world's fastest-growing major economy for the third consecutive year.`,
    category: "Economy",
    imageUrl: "/assets/generated/article-economy.dim_800x450.jpg",
    createdAt: BigInt(Date.now() - 3600000),
  },
  {
    id: BigInt(2),
    title:
      "New AI Breakthrough Enables Real-Time Translation Across 200 Languages",
    summary:
      "Researchers unveil a transformer model that achieves near-human accuracy in real-time translation, removing language barriers globally.",
    content: `A team of researchers from IIT Bombay and Google DeepMind has unveiled a groundbreaking artificial intelligence model capable of real-time translation across more than 200 languages with near-human accuracy.\n\nThe model, named LinguaAI-2026, uses a novel architecture that processes audio, text, and visual context simultaneously, enabling it to handle nuances like idioms, cultural references, and domain-specific terminology.\n\n"We've essentially broken the language barrier," said Prof. Rajesh Kumar, lead researcher at IIT Bombay's AI lab. "The model achieves 94% accuracy on standard benchmarks, compared to 71% for previous state-of-the-art systems."\n\nThe technology has immediate applications in healthcare, legal proceedings, education, and international business. Several pilot programs are already underway in rural India, where healthcare workers are using it to communicate with patients who speak regional dialects.\n\nGoogle DeepMind plans to integrate the technology into existing products, with a public API expected to launch in the coming months. The researchers have also open-sourced the underlying architecture, allowing other developers to build on the breakthrough.`,
    category: "Technology",
    imageUrl: "/assets/generated/article-ai.dim_800x450.jpg",
    createdAt: BigInt(Date.now() - 7200000),
  },
  {
    id: BigInt(3),
    title:
      "IPL 2026: Mumbai Indians Clinch Thrilling Season Opener Against CSK",
    summary:
      "Mumbai Indians defeat Chennai Super Kings by 6 wickets in an electrifying season opener watched by 80,000 fans at Wankhede Stadium.",
    content: `The Indian Premier League 2026 season kicked off with a spectacular clash at Mumbai's iconic Wankhede Stadium, as Mumbai Indians defeated Chennai Super Kings by 6 wickets in a match that kept fans on the edge of their seats until the final over.\n\nChasing CSK's competitive total of 186 runs, Mumbai Indians' young opener Aryan Patel blazed his way to a 47-ball 78, setting the tone for a successful chase. The winning moment came with two balls to spare, sending the packed stadium of 80,000 fans into a frenzy.\n\n"This is the best way to start a season," said Mumbai Indians captain Rohit Sharma after the match. "The team showed great character, especially in the middle overs when we were under pressure."\n\nCSK's MS Dhoni played a cameo of 32 off 18 balls, but it wasn't enough to defend the total. Mumbai's bowling unit, led by Jasprit Bumrah's miserly 2/24, kept CSK to a below-par total in the back end of their innings.\n\nThe IPL 2026 season promises to be one of the most competitive yet, with ten teams fighting for the coveted trophy over 74 matches spanning two months.`,
    category: "Sports",
    imageUrl: "/assets/generated/article-sports.dim_800x450.jpg",
    createdAt: BigInt(Date.now() - 10800000),
  },
  {
    id: BigInt(4),
    title:
      "Health Ministry Launches Nationwide Free Vaccination Drive for Children",
    summary:
      "India's Health Ministry announces a comprehensive vaccination program covering 15 diseases, targeting 200 million children across rural and urban areas.",
    content: `India's Ministry of Health and Family Welfare has launched an ambitious nationwide vaccination drive targeting 200 million children under the age of five, covering protection against 15 major diseases including measles, polio, hepatitis B, and newer threats like rotavirus and pneumococcal infections.\n\nThe program, announced by Health Minister Dr. Priya Nair at a press conference in New Delhi, will be conducted across 750,000 health centers, with special mobile units deployed for remote areas.\n\n"Every child in India deserves protection from preventable diseases, regardless of where they live or their family's economic status," said Dr. Nair. "This initiative will save an estimated 2 million lives over the next decade."\n\nThe drive includes innovative features such as a digital vaccination certificate that parents can access via a mobile app, and an AI-powered scheduling system that sends reminders for follow-up doses. Community health workers, known as ASHA workers, will play a crucial role in reaching the last mile.\n\nWorld Health Organization representatives praised India's initiative, noting that it could serve as a model for other developing nations. The program is expected to significantly boost India's immunization rates, which currently stand at 76% for basic vaccines.`,
    category: "Health",
    imageUrl: "/assets/generated/article-health.dim_800x450.jpg",
    createdAt: BigInt(Date.now() - 14400000),
  },
  {
    id: BigInt(5),
    title:
      "Indian Startup Ecosystem Raises Record ₹1.2 Lakh Crore in 2026 Funding Round",
    summary:
      "India's startup sector shatters all previous records with unprecedented funding, positioning the country as the world's second-largest startup hub.",
    content: `India's startup ecosystem has achieved a historic milestone, raising ₹1.2 lakh crore (approximately $14.5 billion) in the first half of 2026, surpassing all previous annual records with six months still remaining in the year.\n\nThe surge in funding has been led by fintech, healthtech, and clean energy startups, according to a report by NASSCOM and Bain & Company. Over 47 startups achieved unicorn status (valuation exceeding $1 billion) in this period alone.\n\n"India has become the world's second-largest startup hub, after only the United States," said Debjani Ghosh, President of NASSCOM. "The quality of founders, the depth of talent, and increasingly sophisticated investor base are all contributing to this remarkable growth."\n\nBengaluru continues to lead as the startup capital, followed by Mumbai, Delhi-NCR, and emerging hubs like Pune, Hyderabad, and Chennai. Notably, Tier 2 cities like Jaipur, Ahmedabad, and Indore are seeing rapidly growing startup activity.\n\nThe government's Startup India initiative, favorable tax policies, and the successful IPOs of several high-profile companies have created a virtuous cycle of investment and entrepreneurship. Analysts predict India will overtake China as Asia's top startup destination by 2028.`,
    category: "Business",
    imageUrl: "/assets/generated/article-business.dim_800x450.jpg",
    createdAt: BigInt(Date.now() - 18000000),
  },
];

export function coinsToInr(coins: number): number {
  return (coins / 100) * 5;
}

export function formatInr(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}
