// __mocks__/react-icons/wi.js
const React = require("react");

const createMockIcon = (name) => (props) =>
  React.createElement("div", { ...props }, name);

module.exports = {
  WiDaySunny: createMockIcon("WiDaySunny"),
  WiNightClear: createMockIcon("WiNightClear"),
  WiDayCloudy: createMockIcon("WiDayCloudy"),
  WiNightAltCloudy: createMockIcon("WiNightAltCloudy"),
  WiCloud: createMockIcon("WiCloud"),
  WiCloudy: createMockIcon("WiCloudy"),
  WiShowers: createMockIcon("WiShowers"),
  WiDayRain: createMockIcon("WiDayRain"),
  WiNightAltRain: createMockIcon("WiNightAltRain"),
  WiThunderstorm: createMockIcon("WiThunderstorm"),
  WiSnow: createMockIcon("WiSnow"),
  WiFog: createMockIcon("WiFog"),
  WiNa: createMockIcon("WiNa"),
};
