// Conservative West Bengal bounding box for the prototype. Exact boundary polygons can be added later.
function isInWestBengal(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= 21.45 && lat <= 27.25 && lng >= 85.75 && lng <= 89.95;
}
function validCoordinates(lat, lng) { return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180; }
module.exports = { isInWestBengal, validCoordinates };
