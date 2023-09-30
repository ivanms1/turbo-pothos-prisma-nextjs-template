/**
 * Returns true if the window object is defined.
 *
 * The window object is not defined when executing server-side code.  This
 * function is used to check if code is running in the browser or on the server.
 */
function isWindowPresent() {
  return typeof window !== 'undefined';
}

export default isWindowPresent;
