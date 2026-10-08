/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */
import Grid from '@components/grid/grid';

interface GridExtension {
  extend: (grid: Grid) => void;
}

export {Grid, GridExtension};
