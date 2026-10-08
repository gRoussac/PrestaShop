{**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 *}
{function name=rows_browsed}
  {if $data > 400}
    <span class="danger">{$data} rows browsed</span>
  {elseif $data > 100}
    <span class="warning">{$data} rows browsed</span>
  {else}
    <span class="success">{$data} rows browsed</span>
  {/if}
{/function}
