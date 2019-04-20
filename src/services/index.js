export * from "./fake-backend";
export * from "./user.service";
export * from "./thingworx";

const serverURI = `https://dev-etools.ptc.com/Thingworx/`;
// https://community.ptc.com/t5/IoT-Tech-Tips/Make-a-REST-call-from-a-website-to-Thingworx-platform/m-p/534384

export const serviceUrls = {
  login: `${serverURI}Resources/CurrentSessionInfo/Services/GetCurrentUserGroups`,
  logout: `${serverURI}Server/*/Services/Logout`
};
