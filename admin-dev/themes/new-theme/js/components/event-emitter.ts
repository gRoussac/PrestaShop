/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

import {EventEmitter as EventEmitterClass} from 'events';

/**
 * We instanciate one EventEmitter (restricted via a const) so that every components
 * register/dispatch on the same one and can communicate with each other.
 */
export const EventEmitter = new EventEmitterClass();

export default EventEmitter;
