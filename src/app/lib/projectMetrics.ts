import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Types pour les métriques du projet
interface FileMetric {
  path: string;
  size: number;
  lines: number;
  extension: string;
}

export interface ProjectMetrics {
  totalLines: number;
  totalFiles: number;
  totalFolders: number;
  totalSize: number; // Taille totale en octets
  fileTypes: Record<string, number>;
  fileMetrics: FileMetric[];
  dependencies: string[];
  devDependencies: string[];
  frameworks: string[];
  lastCommit: string;
  lastUpdate: string;
  contributors: number;
}

// Extensions de fichiers à inclure dans le comptage de lignes
const CODE_EXTENSIONS = [
  // Frontend
  'js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'sass', 'html', 'json', 'md', 'mdx',
  // Backend
  'py', 'java', 'go', 'rb', 'php', 'cs', 'rs', 'swift', 'kt', 'dart', 'sh',
  // Autres
  'sql', 'graphql', 'gql', 'yaml', 'yml', 'toml', 'ini', 'env'
];

// Dossiers à exclure de l'analyse
const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'out',
  '.vercel',
  '.vscode',
  '.idea',
  'coverage'
];

// Frameworks connus pour détection
const KNOWN_FRAMEWORKS = [
  'next', 'react', 'angular', 'vue', 'svelte', 'express', 'nestjs',
  'gatsby', 'remix', 'nuxt', 'sveltekit', 'astro', 'solid', 'qwik'
];

/**
 * Analyse un fichier et retourne ses métriques
 */
async function analyzeFile(filePath: string): Promise<{lines: number, size: number}> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    return {
      lines: content.split('\n').length,
      size: stats.size
    };
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${filePath}:`, error);
    return { lines: 0, size: 0 };
  }
}

/**
 * Analyse récursive d'un dossier pour collecter des statistiques
 */
async function analyzeDirectory(
  dirPath: string,
  metrics: { 
    totalLines: number; 
    totalFiles: number; 
    totalFolders: number; 
    totalSize: number;
    fileTypes: Record<string, number>;
    fileMetrics: FileMetric[];
  },
  basePath: string = dirPath
): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(basePath, fullPath);
      
      // Ignorer les dossiers exclus
      if (EXCLUDED_DIRS.some(dir => relativePath.startsWith(dir))) {
        continue;
      }

      if (entry.isDirectory()) {
        metrics.totalFolders++;
        await analyzeDirectory(fullPath, metrics, basePath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase().slice(1);
        
        // Ne compter que les fichiers de code
        if (CODE_EXTENSIONS.includes(ext)) {
          const fileAnalysis = await analyzeFile(fullPath);
          
          metrics.totalFiles++;
          metrics.totalLines += fileAnalysis.lines;
          metrics.totalSize += fileAnalysis.size;
          metrics.fileTypes[ext] = (metrics.fileTypes[ext] || 0) + 1;
          
          metrics.fileMetrics.push({
            path: relativePath,
            size: fileAnalysis.size,
            lines: fileAnalysis.lines,
            extension: ext
          });
        }
      }
    }
  } catch (error) {
    console.error(`Erreur lors de l'analyse du dossier ${dirPath}:`, error);
  }
}

/**
 * Récupère les informations Git (dernier commit, contributeurs, etc.)
 */
function getGitInfo(): { lastCommit: string; contributors: number } {
  try {
    // Dernier commit
    const lastCommit = execSync('git log -1 --format=%cd --date=short')
      .toString()
      .trim();
    
    // Nombre de contributeurs
    const contributors = execSync('git shortlog -sne --all')
      .toString()
      .split('\n')
      .filter(Boolean).length;
    
    return { lastCommit, contributors };
  } catch (error) {
    console.error('Erreur lors de la récupération des informations Git:', error);
    return { lastCommit: 'Inconnu', contributors: 0 };
  }
}

/**
 * Récupère les dépendances du projet
 */
async function getDependencies(): Promise<{ dependencies: string[]; devDependencies: string[]; frameworks: string[] }> {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    
    // Détecter les frameworks utilisés
    const frameworks = [...deps, ...devDeps].filter(dep => 
      KNOWN_FRAMEWORKS.some(fw => dep.includes(fw))
    );
    
    return {
      dependencies: deps,
      devDependencies: devDeps,
      frameworks: [...new Set(frameworks)] // Éviter les doublons
    };
  } catch (error) {
    console.error('Erreur lors de la lecture des dépendances:', error);
    return { dependencies: [], devDependencies: [], frameworks: [] };
  }
}

/**
 * Fonction principale pour obtenir toutes les métriques du projet
 */
export async function getProjectMetrics(): Promise<ProjectMetrics> {
  const baseMetrics = {
    totalLines: 0,
    totalFiles: 0,
    totalFolders: 0,
    totalSize: 0,
    fileTypes: {},
    fileMetrics: [] as FileMetric[]
  };

  // Analyser le répertoire du projet
  await analyzeDirectory(process.cwd(), baseMetrics);
  
  // Récupérer les informations Git
  const { lastCommit, contributors } = getGitInfo();
  
  // Récupérer les dépendances
  const { dependencies, devDependencies, frameworks } = await getDependencies();
  
  return {
    ...baseMetrics,
    dependencies,
    devDependencies,
    frameworks,
    lastCommit,
    lastUpdate: new Date().toISOString().split('T')[0],
    contributors
  };
}

// Pour le débogage
if (require.main === module) {
  (async () => {
    const metrics = await getProjectMetrics();
    console.log('Métriques du projet:');
    console.log(JSON.stringify(metrics, null, 2));
  })();
}
