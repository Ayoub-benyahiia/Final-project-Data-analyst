import { JobRecord, StackPreset, ChartData } from "@/types";

export const MOCK_JOBS: JobRecord[] = [
  {
    id: "1",
    title: "Développeur Full Stack",
    company: "OCP Group",
    city: "Casablanca",
    contract: "CDI",
    education: "Bac+5",
    expBucket: "2-5",
    technology: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    postedAt: "2026-08-01",
    workplaceModel: "Hybrid",
    industry: "Industrie",
    seniority: "Mid",
  },
  {
    id: "2",
    title: "Data Engineer",
    company: "Attijariwafa Bank",
    city: "Rabat",
    contract: "CDI",
    education: "Bac+5",
    expBucket: "2-5",
    technology: ["Python", "Spark", "AWS", "PostgreSQL"],
    postedAt: "2026-08-05",
    workplaceModel: "On-site",
    industry: "Banque",
    seniority: "Mid",
  },
  {
    id: "3",
    title: "Développeur Frontend",
    company: "Capgemini",
    city: "Casablanca",
    contract: "CDI",
    education: "Bac+3",
    expBucket: "0-2",
    technology: ["React", "TypeScript", "Tailwind CSS"],
    postedAt: "2026-08-10",
    workplaceModel: "Hybrid",
    industry: "IT Services",
    seniority: "Junior",
  },
];

export const CITIES = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Agadir", "Tétouan", "Oujda", "Kenitra", "Safi"];
export const CONTRACTS = ["CDI", "CDD", "Freelance", "Stage", "Alternance"];
export const EDUCATIONS = ["Bac", "Bac+2", "Bac+3", "Bac+5", "Doctorat"];
export const EXP_BUCKETS = ["0-2", "2-5", "5-10", "10+"];
export const TECHNOLOGIES = [
  "React", "Angular", "Vue.js", "Next.js", "Node.js", "Python", "Java", "Spring Boot",
  ".NET", "C#", "PHP", "Laravel", "Symfony", "Ruby", "Go", "Rust", "TypeScript",
  "JavaScript", "HTML/CSS", "Tailwind CSS", "Docker", "Kubernetes", "AWS", "Azure",
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "GraphQL", "REST API", "Git", "CI/CD",
  "Agile", "Scrum", "Jira", "Figma", "Linux", "Windows Server", "Power BI", "Tableau",
  "Machine Learning", "TensorFlow", "PyTorch", "Spark", "Hadoop", "Kafka", "Elasticsearch",
];

export const STACK_PRESETS: StackPreset[] = [
  { name: "MERN", technologies: ["MongoDB", "Express", "React", "Node.js"], icon: "Layers" },
  { name: "Java Spring", technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker"], icon: "Coffee" },
  { name: ".NET", technologies: [".NET", "C#", "SQL Server", "Azure"], icon: "Box" },
  { name: "Python Data", technologies: ["Python", "Pandas", "TensorFlow", "PostgreSQL"], icon: "BarChart3" },
];

export const generateContractsData = (): ChartData[] => [
  { name: "CDI", value: 6234 },
  { name: "CDD", value: 2156 },
  { name: "Freelance", value: 1432 },
  { name: "Stage", value: 678 },
  { name: "Alternance", value: 282 },
];

export const generateTrendData = (): ChartData[] => {
  const data: ChartData[] = [];
  for (let year = 2016; year <= 2025; year++) {
    data.push({
      name: String(year),
      value: Math.floor(800 + (year - 2016) * 950 + Math.random() * 400),
      remote: Math.floor((year - 2016) * 120 + Math.random() * 100),
    });
  }
  return data;
};

export const generateRegionalData = (): ChartData[] => [
  { name: "Casablanca", value: 3687 },
  { name: "Rabat", value: 2156 },
  { name: "Marrakech", value: 1243 },
  { name: "Tanger", value: 987 },
  { name: "Fès", value: 654 },
  { name: "Agadir", value: 543 },
  { name: "Tétouan", value: 432 },
  { name: "Oujda", value: 321 },
  { name: "Kenitra", value: 287 },
  { name: "Safi", value: 198 },
];

export const generateEducationData = (): ChartData[] => [
  { name: "Bac+5", value: 4521 },
  { name: "Bac+3", value: 3210 },
  { name: "Bac+2", value: 1876 },
  { name: "Doctorat", value: 654 },
  { name: "Bac", value: 521 },
];

export const generateSkillsData = (): ChartData[] => [
  { name: "React", value: 3245 },
  { name: "JavaScript", value: 2987 },
  { name: "Node.js", value: 2654 },
  { name: "TypeScript", value: 2345 },
  { name: "Python", value: 2123 },
  { name: "Java", value: 1987 },
  { name: "Angular", value: 1765 },
  { name: "PHP", value: 1654 },
  { name: "SQL", value: 1543 },
  { name: "Docker", value: 1432 },
  { name: "AWS", value: 1321 },
  { name: "Git", value: 1298 },
  { name: "Spring Boot", value: 1187 },
  { name: "Laravel", value: 1098 },
  { name: "Vue.js", value: 987 },
];
