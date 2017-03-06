import QuinoaNetwork from './Network/Network';
import QuinoaMap from './Map/Map';
import QuinoaTimeline from './Timeline/Timeline';
import QuinoaSVGViewer from './SVGViewer/SVGViewer';

import QMapDataMapper from './utils/mapDataMapper';
import QTimelineDataMapper from './utils/timelineDataMapper';
import QNetworkDataMapper from './utils/networkDataMapper';

import QMapDataParser from './utils/mapDataParser';
import QTimelineDataParser from './utils/timelineDataParser';
import QNetworkDataParser from './utils/networkDataParser';

export const Network = QuinoaNetwork;
export const Map = QuinoaMap;
export const SVGViewer = QuinoaSVGViewer;
export const Timeline = QuinoaTimeline;

export const parseMapData = QMapDataParser;
export const parseTimelineData = QTimelineDataParser;
export const parseNetworkData = QNetworkDataParser;

export const mapMapData = QMapDataMapper;
export const mapTimelineData = QTimelineDataMapper;
export const mapNetworkData = QNetworkDataMapper;
