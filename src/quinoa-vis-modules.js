require('../sigma/sigma.min.js');
require('../sigma/sigma.layout.forceAtlas2.min.js');
require('../sigma/sigma.parsers.gexf.min.js');
require('../sigma/sigma.plugins.saveCamera.js');

import QuinoaNetwork from './Network/Network';
import QuinoaMap from './Map/Map';
import QuinoaTimeline from './Timeline/Timeline';

export const Network = QuinoaNetwork;
export const Map = QuinoaMap;
export const Timline = QuinoaTimeline;
