/**
 * Analyzes C source code to detect expected stdin inputs and prompts
 */

export interface InputStep {
  id: string;
  line: number;
  prompt: string;
  type: 'integer' | 'float' | 'character' | 'string' | 'general';
  specifier?: string;
}

export function detectExpectedInputs(code: string): InputStep[] {
  if (!code) return [];

  const steps: InputStep[] = [];
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Scan for scanf(...)
    const scanfMatch = line.match(/scanf\s*\(\s*"([^"]+)"/);
    if (scanfMatch) {
      const formatStr = scanfMatch[1];
      // Find previous printf prompt if available
      let prompt = '';
      for (let prevIdx = i - 1; prevIdx >= Math.max(0, i - 4); prevIdx--) {
        const pMatch = lines[prevIdx].match(/printf\s*\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
        if (pMatch) {
          prompt = pMatch[1]
            .replace(/\\n/g, '')
            .replace(/\\t/g, '')
            .replace(/\\r/g, '')
            .trim();
          if (prompt) break;
        }
      }

      // Extract format specifiers like %d, %lf, %f, %c, %s, %ld
      const specifiers = formatStr.match(/%[-+0-9.]*[a-zA-Z]/g) || [];

      if (specifiers.length === 0) {
        steps.push({
          id: `step-${i}-0`,
          line: i + 1,
          prompt: prompt || 'Enter input',
          type: 'general',
        });
      } else {
        specifiers.forEach((spec, specIdx) => {
          let type: InputStep['type'] = 'general';
          if (spec.includes('d') || spec.includes('i') || spec.includes('u') || spec.includes('x')) {
            type = 'integer';
          } else if (spec.includes('f') || spec.includes('g') || spec.includes('e') || spec.includes('lf')) {
            type = 'float';
          } else if (spec.includes('c')) {
            type = 'character';
          } else if (spec.includes('s')) {
            type = 'string';
          }

          const stepPrompt =
            specifiers.length > 1
              ? `${prompt || 'Enter value'} (${specIdx + 1}/${specifiers.length})`
              : prompt || `Enter ${type} value`;

          steps.push({
            id: `step-${i}-${specIdx}`,
            line: i + 1,
            prompt: stepPrompt,
            type,
            specifier: spec,
          });
        });
      }
    }

    // 2. Scan for fgets(..., ..., stdin)
    const fgetsMatch = line.match(/fgets\s*\(\s*[^,]+,\s*[^,]+,\s*stdin\s*\)/);
    if (fgetsMatch) {
      let prompt = '';
      if (i > 0) {
        const pMatch = lines[i - 1].match(/printf\s*\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
        if (pMatch) {
          prompt = pMatch[1].replace(/\\n/g, '').trim();
        }
      }
      steps.push({
        id: `step-${i}-fgets`,
        line: i + 1,
        prompt: prompt || 'Enter text line',
        type: 'string',
      });
    }

    // 3. Scan for getchar()
    const getcharMatch = line.match(/getchar\s*\(\s*\)/);
    if (getcharMatch && !line.includes('while') && !line.includes('//')) {
      let prompt = '';
      if (i > 0) {
        const pMatch = lines[i - 1].match(/printf\s*\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
        if (pMatch) {
          prompt = pMatch[1].replace(/\\n/g, '').trim();
        }
      }
      steps.push({
        id: `step-${i}-getchar`,
        line: i + 1,
        prompt: prompt || 'Press any key / character',
        type: 'character',
      });
    }
  }

  return steps;
}

/**
 * Checks whether the C source code asks for input from stdin
 */
export function codeRequiresStdin(code: string): boolean {
  if (!code) return false;
  return (
    /scanf\s*\(/.test(code) ||
    /fgets\s*\([^,]+,[^,]+,\s*stdin\s*\)/.test(code) ||
    /getchar\s*\(/.test(code) ||
    /getc\s*\(\s*stdin\s*\)/.test(code) ||
    /cin\s*>>/.test(code)
  );
}
