import * as small from './terminal/terminal-small'
import * as big from './terminal/terminal'

export function render (qrData, options, cb) {
  if (options?.small) {
    return small.render(qrData, options, cb);
  }
  return big.render(qrData, options, cb);
}
