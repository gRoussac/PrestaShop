/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */
interface PaginationServiceType {
  fetch: (offset: number, limit: number) => Promise<FetchResponse> | JQuery.jqXHR<any>;
}

export default PaginationServiceType;
