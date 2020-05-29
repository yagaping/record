import * as React from "react";
export interface PhoneSimulatorProps {
  className?: string,
  url?: string,
  viewUrl?: string;
  html?: string;
  title?: string;
  newsSource?: string;
  newsTime?: string;
}

export default class PhoneSimulator extends React.Component<PhoneSimulatorProps, any> {}
