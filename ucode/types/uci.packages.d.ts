/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./uci.types.d.ts" />

declare module 'uci' {
  // collectd

  export type ICollectdGlobalsSection = INamedSection<'globals'> & {
    alt_config_file: option_data;
  };
  export type ICollectdPackage = IPackage & {
    globals: ICollectdGlobalsSection;
  };

  // dhcp

  export type IDhcpDnsmasqSection = IAnonymousSection<'dnsmasq'> & {
    addnhosts?: list_data;
    authoritative?: bool_data;
    boguspriv?: bool_data;
    domain?: option_data;
    domainneeded?: bool_data;
    ednspacket_max?: option_data;
    expandhosts?: bool_data;
    filterwin2k?: bool_data;
    leasefile?: option_data;
    local?: option_data;
    localise_queries?: bool_data;
    localservice?: bool_data;
    nonegcache?: bool_data;
    nonwildcard?: bool_data;
    readethers?: bool_data;
    rebind_localhost?: bool_data;
    rebind_protection?: bool_data;
    resolvfile?: option_data;
  };

  export type IDhcpDhcpSection = INamedSection<'dhcp'> & {
    dhcpv4?: option_data;
    force?: bool_data;
    ignore?: bool_data;
    interface?: option_data;
    leasetime?: option_data;
    limit?: option_data;
    ra_flags?: list_data;
    start?: option_data;
  };

  export type IDhcpOdhcpdSection = INamedSection<'odhcpd'> & {
    maindhcp?: bool_data;
  };

  export type IDhcpHostSection = IAnonymousSection<'host'> & {
    dns?: bool_data;
    ip?: option_data;
    mac?: option_data;
    name?: option_data;
  };

  export type IDhcpPackage = IPackage & {
    odhcpd?: IDhcpOdhcpdSection;
  } & {
    [K in SectionName]: IDhcpDnsmasqSection | IDhcpDhcpSection | IDhcpHostSection;
  };

  // network

  export type NetworkInterfaceProto =
    | 'static' //	Static configuration with fixed address and netmask	ip/ifconfig
    | 'dhcp' //	Address and netmask are assigned by DHCP	udhcpc (Busybox)
    | 'dhcpv6' //	Address and netmask are assigned by DHCPv6	odhcpc6c
    | 'ppp' //	PPP protocol - dialup modem connections	pppd
    | 'pppoe' //	PPP over Ethernet - DSL broadband connection	pppd + plugin rp-pppoe.so
    | 'pppoa' //	PPP over ATM - DSL connection using a builtin modem	pppd + plugin …
    | '3g' //	CDMA, UMTS or GPRS connection using an AT-style 3G modem	comgt
    | 'qmi' //	USB modems using QMI protocol	uqmi
    | 'ncm' //	USB modems using NCM protocol	comgt-ncm + ?
    | 'wwan' //	USB modems with protocol autodetection	wwan
    | 'hnet' //	Self-managing home network (HNCP)	hnet-full
    | 'pptp' //	Connection via PPtP VPN	?
    | '6in4' //	IPv6-in-IPv4 tunnel for use with Tunnel Brokers like HE.net	?
    | 'aiccu' //	Anything-in-anything tunnel	aiccu
    | '6to4' //	Stateless IPv6 over IPv4 transport	?
    | '6rd' //	IPv6 rapid deployment	6rd
    | 'dslite' //	Dual-Stack Lite	ds-lite
    | 'l2tp' //	PPP over L2TP Pseudowire Tunnel	xl2tpd
    | 'relay' //	relayd pseudo-bridge	relayd
    | 'gre' //, gretap	GRE over IPv4	gre + kmod-gre
    | 'grev6' //, grev6tap	GRE over IPv6	gre + kmod-gre6
    | 'vti' //	VTI over IPv4	vti + kmod-ip_vti
    | 'vtiv6' //	VTI over IPv6	vti + kmod-ip6_vti
    | 'vxlan' //	VXLAN protocol for layer 2 virtualization, see here for further information and a configuration example	vxlan + kmod-vxlan + ip-full
    | 'none'; //	Unspecified protocol, therefore all the other interface settings will be ignored (like disabling the configuration)

  export type INetworkInterfaceSection = INamedSection<'interface'> & {
    addresses?: option_data;
    apn?: option_data;
    auth?: option_data;
    auto?: bool_data;
    broadcast?: bool_data;
    classlessroute?: bool_data;
    clientid?: option_data;
    customroutes?: option_data;
    defaultroute?: bool_data;
    device?: option_data;
    dns_search?: list_data;
    dns?: list_data;
    gateway?: option_data;
    hostname?: option_data;
    ipaddr?: option_data;
    metric?: option_data;
    netmask?: option_data;
    norelease?: bool_data;
    password?: option_data;
    pdptype?: option_data;
    peerdns?: bool_data;
    private_key?: option_data;
    proto: NetworkInterfaceProto;
    reqopts?: option_data;
    sendopts?: option_data;
    username?: option_data;
    vendorid: option_data;
    zone?: option_data;
  };

  export type INetworkGlobalSection = INamedSection<'globals'> & {
    packet_steering?: bool_data;
    ula_prefix?: 'auto' | option_data;
  };

  export type INetworkDeviceSection = IAnonymousSection<'device'> & {
    acceptlocal?: bool_data;
    bridge_empty?: bool_data;
    dadtransmits?: option_data;
    igmpversion?: '1' | '2' | '3';
    ipv6?: bool_data;
    macaddr?: option_data;
    mldversion?: '1' | '2';
    mtu?: option_data;
    mtu6?: option_data;
    multicast?: bool_data;
    name: option_data;
    neighgcstaletime?: bool_data;
    neighlocktime?: bool_data;
    neighreachabletime?: bool_data;
    ports?: list_data;
    promisc?: bool_data;
    rpfilter?: 'loose' | 'strict';
    sendredirects?: bool_data;
    stp?: bool_data;
    txqueuelen?: option_data;
    type: 'bridge' | '8021q' | '8021ad' | 'macvlan' | 'veth';
  };

  export type INetworkWireguardSection = IAnonymousSection<'wireguard_X'> & {
    allowed_ips?: list_data;
    description?: option_data;
    disabled?: bool_data;
    endpoint_host?: option_data;
    endpoint_port?: option_data;
    persistent_keepalive?: option_data;
    preshared_key?: option_data;
    private_key?: option_data;
    public_key?: option_data;
    route_allowed_ips?: bool_data;
  };

  export type INetworkPackage = IPackage & {
    globals?: INetworkGlobalSection;
  } & {
    [K in SectionName]: INetworkInterfaceSection | INetworkDeviceSection | INetworkWireguardSection;
  };

  export type IRpcdRpcdSection = IAnonymousSection<'rpcd'> & {
    socket: option_data;
    timeout: option_data;
  };

  export type IRpcdLoginSection = IAnonymousSection<'login'> & {
    password: option_data;
    read: list_data;
    username: option_data;
    write: list_data;
  };

  export type IRpcdPackage = IPackage & {
    [K in SectionName]: IRpcdLoginSection | IRpcdRpcdSection;
  };

  export type IWirelessDeviceSection = INamedSection<'wifi-device'> & {
    band?: '2g' | '5g';
    channel?: option_data;
    country?: Uppercase<option_data>;
    disabled?: bool_data;
    htmode?: option_data;
    path?: option_data;
    type?: 'mac80211' | option_data;
  };

  export type IWirelessIfaceSection = INamedSection<'wifi-iface'> & {
    device?: option_data;
    disabled?: bool_data;
    encryption?: 'psk2' | option_data;
    key?: option_data;
    mode?: 'ap' | option_data;
    network?: option_data;
    ssid?: option_data;
  };
  export type IWirelessPackage = IPackage & {
    [K in SectionName]: IWirelessDeviceSection | IWirelessIfaceSection;
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  export type IXinetdPackage = IPackage & {};

  export interface IConfigData {
    collectd?: ICollectdPackage;
    dhcp?: IDhcpPackage;
    network?: INetworkPackage;
    rpcd?: IRpcdPackage;
    wireless?: IWirelessPackage;
    xinetd?: IXinetdPackage;
  }
}
