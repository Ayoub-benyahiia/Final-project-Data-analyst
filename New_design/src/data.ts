import { GrowthDataPoint, FAQItem, TestimonialItem, TechRadarItem } from './types';

export const growthData: GrowthDataPoint[] = [
  { year: '2016', Casablanca: 1520, Rabat: 780, Tangier: 120, Marrakech: 90 },
  { year: '2017', Casablanca: 1640, Rabat: 850, Tangier: 150, Marrakech: 110 },
  { year: '2018', Casablanca: 1840, Rabat: 980, Tangier: 190, Marrakech: 140 },
  { year: '2019', Casablanca: 1960, Rabat: 1060, Tangier: 220, Marrakech: 160 },
  { year: '2020', Casablanca: 2110, Rabat: 1150, Tangier: 240, Marrakech: 180 },
  { year: '2021', Casablanca: 2290, Rabat: 1280, Tangier: 290, Marrakech: 220 },
  { year: '2022', Casablanca: 2480, Rabat: 1420, Tangier: 350, Marrakech: 260 },
  { year: '2023', Casablanca: 2650, Rabat: 1570, Tangier: 410, Marrakech: 310 },
  { year: '2024', Casablanca: 2890, Rabat: 1750, Tangier: 480, Marrakech: 380 },
  { year: '2025', Casablanca: 3060, Rabat: 1930, Tangier: 540, Marrakech: 440 },
  { year: '2026', Casablanca: 3240, Rabat: 2120, Tangier: 610, Marrakech: 512 },
];

export const techRadarData: TechRadarItem[] = [
  { name: 'TypeScript / React', growth: 38.4, volume: 2450, avgSalary: 28000, experienceLevel: 'Mid' },
  { name: 'Java / Spring Boot', growth: 12.2, volume: 2120, avgSalary: 26000, experienceLevel: 'Senior' },
  { name: 'Python / Django / FastAPI', growth: 42.1, volume: 1680, avgSalary: 30000, experienceLevel: 'Mid' },
  { name: 'PHP / Laravel', growth: -4.5, volume: 1210, avgSalary: 16000, experienceLevel: 'Junior' },
  { name: 'DevOps / Kubernetes', growth: 48.6, volume: 1540, avgSalary: 38000, experienceLevel: 'Lead' },
  { name: 'C# / .NET Core', growth: 8.3, volume: 1120, avgSalary: 24000, experienceLevel: 'Senior' },
  { name: 'SQL / dbt / Snowflake', growth: 52.3, volume: 980, avgSalary: 32000, experienceLevel: 'Mid' },
  { name: 'Node.js / Express', growth: 22.1, volume: 1820, avgSalary: 23000, experienceLevel: 'Mid' },
];

export const faqs: FAQItem[] = [
  {
    q: 'Where does the market data originate, and how do you guarantee its accuracy?',
    a: 'We automatically index, clean, and deduplicate technical job postings from Morocco\'s top platforms, primarily ReKrute.com and official corporate portals. Duplicate postings, multi-listed roles, and non-tech positions are filtered out to ensure we provide recruiters and builders with Morocco\'s cleanest, most accurate tech-salary dataset.',
  },
  {
    q: 'How frequently is the platform updated?',
    a: 'Our smart crawlers compile new job data twice daily. The dashboard is refreshed weekly to ensure you are seeing real-time market swings, in-demand technical stacks, and accurate salary trends across a 10-year rolling window (2016-2026).',
  },
  {
    q: 'How does TechJob Analytics group and filter tech stack trends?',
    a: 'We map raw job descriptions and candidate expectations into standardized technical dimensions (e.g. frameworks, contract modalities, cities, and experience brackets). This allows you to slice the entire Moroccan market by tags like "Casablanca + React + Senior" instantly to get live recruitment and salary benchmarks in seconds.',
  },
  {
    q: 'Can TechJob Analytics replace expensive custom compensation reports?',
    a: 'Yes, and with much higher accuracy. Traditional HR consultancy reports cost upwards of 25,000 MAD and are outdated by the time they are delivered. TechJob Analytics offers real-time, transaction-level salary trends and in-demand skills mapped directly from live Moroccan tech recruitments.',
  },
  {
    q: 'How does the data export system work?',
    a: 'You can export filtered results directly as CSV spreadsheets or ready-to-present PDF reports with active filters. This makes it effortless to include real market indicators in your hiring proposals, salary reviews, or investor pitches.',
  },
  {
    q: 'Is there a cost to access this data?',
    a: 'No, access to our primary interactive market analytics dashboard, tech stack grids, and region maps is 100% free as part of our community open-intelligence initiative to support the growth of the Moroccan tech ecosystem.',
  }
];

export const testimonials: TestimonialItem[] = [
  {
    quote: 'Before TechJob Analytics, our negotiations with Casablanca developers were based on intuition or outdated agency reports. This tool allowed us to align our salary grids precisely with the market, increasing our offer-to-accept rate by 34%.',
    name: 'Sara Meliani',
    role: 'Lead Tech Recruiter',
    company: 'Capgemini Morocco',
    avatar: 'SM',
    rating: 5,
    tags: ['Recruiting', 'Casablanca', 'Salary Grid']
  },
  {
    quote: 'As an engineer, navigating the Moroccan job market can feel like flying blind. Slicing the data by technology and experience gave me concrete proof that my React and TypeScript skills commanded a premium in Rabat. I secured a 13,000 MAD/month bump.',
    name: 'Youssef Benzekri',
    role: 'Senior Frontend Architect',
    company: 'FinTech Hub',
    avatar: 'YB',
    rating: 5,
    tags: ['Software Engineer', 'Salary Negotiation', 'React']
  },
  {
    quote: 'The geospatial density mapping saved our executive board from making a costly mistake. We were planning on opening a development hub in Casablanca, but the YoY trends and lower competitive index for Spring Boot in Rabat convinced us to pivot there.',
    name: 'Hassan Rachiq',
    role: 'CTO',
    company: 'SoraPay',
    avatar: 'HR',
    rating: 5,
    tags: ['Executive Board', 'Rabat', 'Expansion']
  },
  {
    quote: 'This is the first time we have seen a genuinely professional, database-driven approach to the Moroccan digital economy. Slicing company hubs to track where senior engineers are migrating has reshaped our talent retention program completely.',
    name: 'Nadia Tazi',
    role: 'Head of Talent',
    company: 'DXC Technology',
    avatar: 'NT',
    rating: 5,
    tags: ['Retention', 'Company Hub', 'Data-Driven']
  },
  {
    quote: 'We use the automated alerts API to track tech stack volume shifts. Knowing that Spring Boot demand spiked +14% while Django stabilized helped us pre-train our consulting pool to meet Q4 enterprise demands.',
    name: 'Karim Lahlou',
    role: 'VP of Delivery',
    company: 'CGI Casablanca',
    avatar: 'KL',
    rating: 5,
    tags: ['Consulting', 'API Integration', 'Java']
  },
  {
    quote: 'The level of technical rigor here is superb. From ANOVA validation of salary bands to deduplication of job boards, the team behind this platform actually understands data science. Essential tool for anyone serious about tech hiring.',
    name: 'Amine Kettani',
    role: 'Lead Data Scientist',
    company: 'Attijariwafa Bank',
    avatar: 'AK',
    rating: 5,
    tags: ['Data Science', 'Deduplication', 'Validation']
  }
];

export const companyHubProfiles = [
  { name: 'CGI Casablanca', activeJobs: 142, topTech: 'Java, React, Cloud', segment: 'Multinational ESN' },
  { name: 'Capgemini Maroc', activeJobs: 210, topTech: 'Angular, Spring, Azure', segment: 'Multinational ESN' },
  { name: 'Sopra Steria', activeJobs: 88, topTech: 'TypeScript, PHP, Salesforce', segment: 'Nearshoring' },
  { name: 'Orange Business', activeJobs: 115, topTech: 'DevOps, Python, Kubernetes', segment: 'Telecom / Cloud' },
  { name: 'DXC Technology', activeJobs: 134, topTech: 'Java, .NET, Linux', segment: 'Enterprise IT' },
  { name: 'Inwi Tech', activeJobs: 45, topTech: 'React Native, Node.js, Go', segment: 'Product Corp' }
];
