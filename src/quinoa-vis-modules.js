require('../sigma/sigma.min.js');
require('../sigma/sigma.layout.forceAtlas2.min.js');
require('../sigma/sigma.parsers.gexf.min.js');
require('../sigma/sigma.plugins.saveCamera.js');

import QuinoaNetwork from './Network/Network';
import QuinoaMap from './Map/Map';
import QuinoaTimeline from './Timeline/Timeline';

import QMapDataMapper from './utils/mapDataMapper';
import QTimelineDataMapper from './utils/timelineDataMapper';
import QNetworkDataMapper from './utils/networkDataMapper';

import QMapDataParser from './utils/mapDataMapper';
import QTimelineDataParser from './utils/timelineDataParser';
import QNetworkDataParser from './utils/networkDataParser';

export const Network = QuinoaNetwork;
export const Map = QuinoaMap;
export const Timline = QuinoaTimeline;

export const parseMapData = QMapDataParser;
export const parseTimelineData = QTimelineDataParser;
export const parseNetworkData = QNetworkDataParser;

export const mapMapData = QMapDataMapper;
export const mapTimelineData = QTimelineDataMapper;
export const mapNetworkData = QNetworkDataMapper;