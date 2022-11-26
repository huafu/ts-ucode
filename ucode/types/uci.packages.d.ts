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
		domainneeded?: bool_data;
		boguspriv?: bool_data;
		filterwin2k?: bool_data;
		localise_queries?: bool_data;
		rebind_protection?: bool_data;
		rebind_localhost?: bool_data;
		expandhosts?: bool_data;
		nonegcache?: bool_data;
		authoritative?: bool_data;
		readethers?: bool_data;
		leasefile?: option_data;
		resolvfile?: option_data;
		nonwildcard?: bool_data;
		localservice?: bool_data;
		ednspacket_max?: option_data;
		local?: option_data;
		domain?: option_data;
		addnhosts?: list_data;
	};

	export type IDhcpDhcpSection = INamedSection<'dhcp'> & {
		interface?: option_data;
		start?: option_data;
		limit?: option_data;
		dhcpv4?: option_data;
		ra_flags?: list_data;
		force?: bool_data;
		leasetime?: option_data;
		ignore?: bool_data;
	};

	export type IDhcpOdhcpdSection = INamedSection<'odhcpd'> & {
		maindhcp?: bool_data;
	};

	export type IDhcpHostSection = IAnonymousSection<'host'> & {
		name?: option_data;
		mac?: option_data;
		ip?: option_data;
		dns?: bool_data;
	};

	export type IDhcpPackage = IPackage & {
		odhcpd?: IDhcpOdhcpdSection;
	} & {
		[K: SectionName]: IDhcpDnsmasqSection | IDhcpDhcpSection | IDhcpHostSection;
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
		name: option_data;
		type: 'bridge' | '8021q' | '8021ad' | 'macvlan' | 'veth';
		ports?: list_data;
		ipv6?: bool_data;
		stp?: bool_data;
		bridge_empty?: bool_data;
		promisc?: bool_data;
		mtu?: option_data;
		mtu6?: option_data;
		macaddr?: option_data;
		txqueuelen?: option_data;
		dadtransmits?: option_data;
		rpfilter?: 'loose' | 'strict';
		acceptlocal?: bool_data;
		sendredirects?: bool_data;
		neighreachabletime?: bool_data;
		neighgcstaletime?: bool_data;
		neighlocktime?: bool_data;
		multicast?: bool_data;
		igmpversion?: '1' | '2' | '3';
		mldversion?: '1' | '2';
	};

	export type INetworkWireguardSection = IAnonymousSection<'wireguard_X'> & {
		disabled?: bool_data;
		description?: option_data;
		public_key?: option_data;
		private_key?: option_data;
		preshared_key?: option_data;
		allowed_ips?: list_data;
		route_allowed_ips?: bool_data;
		endpoint_host?: option_data;
		endpoint_port?: option_data;
		persistent_keepalive?: option_data;
	};

	export type INetworkPackage = IPackage & {
		globals?: INetworkGlobalSection;
	} & {
		[K: SectionName]: INetworkInterfaceSection | INetworkDeviceSection | INetworkWireguardSection;
	};

	export type IRpcdRpcdSection = IAnonymousSection<'rpcd'> & {
		socket: option_data;
		timeout: option_data;
	};

	export type IRpcdLoginSection = IAnonymousSection<'login'> & {
		username: option_data;
		password: option_data;
		read: list_data;
		write: list_data;
	};

	export type IRpcdPackage = IPackage & {
		[K: SectionName]: IRpcdLoginSection | IRpcdRpcdSection;
	};

	/* 
	export interface Cfg014dd4 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    PasswordAuth: string;
	    RootPasswordAuth: string;
	    Port: string;
	}

	export interface Dropbear {
	    cfg014dd4: Cfg014dd4;
	}

	export interface Cfg01e63d {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    syn_flood: string;
	    input: string;
	    output: string;
	    forward: string;
	    disable_ipv6: string;
	}

	export interface Cfg02dc81 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    name: string;
	    network: string[];
	    input: string;
	    output: string;
	    forward: string;
	}

	export interface Cfg03dc81 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    name: string;
	    network: string[];
	    input: string;
	    output: string;
	    forward: string;
	    masq: string;
	    mtu_fix: string;
	}

	export interface Cfg04ad58 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    src: string;
	    dest: string;
	}

	export interface Cfg0592bd {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    name: string;
	    src: string;
	    proto: string;
	    dest_port: string;
	    target: string;
	    family: string;
	}

	export interface Cfg0692bd {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    name: string;
	    src: string;
	    proto: string;
	    icmp_type: string;
	    family: string;
	    target: string;
	}

	export interface Cfg0792bd {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    name: string;
	    src: string;
	    proto: string;
	    family: string;
	    target: string;
	}

	export interface Cfg0892bd {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    name: string;
	    src: string;
	    dest: string;
	    proto: string;
	    target: string;
	}

	export interface Cfg0992bd {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    name: string;
	    src: string;
	    dest: string;
	    dest_port: string;
	    proto: string;
	    target: string;
	}

	export interface Cfg0adc81 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    name: string;
	    network: string;
	    input: string;
	    output: string;
	    forward: string;
	}

	export interface Cfg0bad58 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    src: string;
	    dest: string;
	}

	export interface Cfg0cdc81 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    name: string;
	    network: string;
	    input: string;
	    output: string;
	    forward: string;
	}

	export interface Cfg0dad58 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    src: string;
	    dest: string;
	}

	export interface Firewall {
	    cfg01e63d: Cfg01e63d;
	    cfg02dc81: Cfg02dc81;
	    cfg03dc81: Cfg03dc81;
	    cfg04ad58: Cfg04ad58;
	    cfg0592bd: Cfg0592bd;
	    cfg0692bd: Cfg0692bd;
	    cfg0792bd: Cfg0792bd;
	    cfg0892bd: Cfg0892bd;
	    cfg0992bd: Cfg0992bd;
	    cfg0adc81: Cfg0adc81;
	    cfg0bad58: Cfg0bad58;
	    cfg0cdc81: Cfg0cdc81;
	    cfg0dad58: Cfg0dad58;
	}

	export interface Main {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    lang: string;
	    mediaurlbase: string;
	    resourcebase: string;
	    ubuspath: string;
	}

	export interface FlashKeep {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    uci: string;
	    dropbear: string;
	    openvpn: string;
	    passwd: string;
	    opkg: string;
	    firewall: string;
	    uploads: string;
	}

	export interface Languages {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	}

	export interface Sauth {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    sessionpath: string;
	    sessiontime: string;
	}

	export interface Ccache {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    enable: string;
	}

	export interface Themes {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    Bootstrap: string;
	    BootstrapDark: string;
	    BootstrapLight: string;
	}

	export interface Apply {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    rollback: string;
	    holdoff: string;
	    timeout: string;
	    display: string;
	}

	export interface Diag {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    dns: string;
	    ping: string;
	    route: string;
	}

	export interface Luci {
	    main: Main;
	    flash_keep: FlashKeep;
	    languages: Languages;
	    sauth: Sauth;
	    ccache: Ccache;
	    themes: Themes;
	    apply: Apply;
	    diag: Diag;
	}

	export interface Owrt {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    use_uci: string;
	}

	export interface Mosquitto2 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    no_remote_access: string;
	    log_dest: string;
	    allow_anonymous: string;
	    password_file: string;
	    acl_file: string;
	}

	export interface Cfg03a28b {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    port: string;
	    protocol: string;
	    bind_address: string;
	}

	export interface Cfg04a28b {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    port: string;
	    protocol: string;
	    bind_address: string;
	}

	export interface Cfg05a28b {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    port: string;
	    protocol: string;
	    bind_address: string;
	}

	export interface Persistence {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    persistence: string;
	    location: string;
	    file: string;
	}

	export interface Cfg07c6b2 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    connection: string;
	    address: string;
	    topic: string[];
	    cleansession: string;
	    remote_username: string;
	    remote_password: string;
	}

	export interface Mosquitto {
	    owrt: Owrt;
	    mosquitto: Mosquitto2;
	    cfg03a28b: Cfg03a28b;
	    cfg04a28b: Cfg04a28b;
	    cfg05a28b: Cfg05a28b;
	    persistence: Persistence;
	    cfg07c6b2: Cfg07c6b2;
	}

	export interface Globals2 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    mmx_mask: string;
	    logging: string;
	    loglevel: string;
	}

	export interface Wan2 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    enabled: string;
	    family: string;
	    initial_state: string;
	    count: string;
	    track_ip: string[];
	}

	export interface Wwan2 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    family: string;
	    initial_state: string;
	    count: string;
	    track_ip: string[];
	    enabled: string;
	}

	export interface WanM1W3 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    interface: string;
	    metric: string;
	    weight: string;
	}

	export interface WanM2W3 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    interface: string;
	    metric: string;
	    weight: string;
	}

	export interface WwanM1W2 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    interface: string;
	    metric: string;
	    weight: string;
	}

	export interface WwanM2W2 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    interface: string;
	    metric: string;
	    weight: string;
	}

	export interface WanFailover {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    use_member: string[];
	    last_resort: string;
	}

	export interface DefaultRuleV4 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    dest_ip: string;
	    family: string;
	    use_policy: string;
	}

	export interface Mwan3 {
	    globals: Globals2;
	    wan: Wan2;
	    wwan: Wwan2;
	    wan_m1_w3: WanM1W3;
	    wan_m2_w3: WanM2W3;
	    wwan_m1_w2: WwanM1W2;
	    wwan_m2_w2: WwanM2W2;
	    wan_failover: WanFailover;
	    default_rule_v4: DefaultRuleV4;
	}

	export interface Global {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    uci_enable: string;
	}

	export interface TekadomUi {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    listen: string[];
	    server_name: string;
	    include: string[];
	    access_log: string;
	    error_log: string;
	}

	export interface TekadomUiExt {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    listen: string[];
	    server_name: string;
	    include: string[];
	    access_log: string;
	    error_log: string;
	}

	export interface Luci2 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    listen: string[];
	    server_name: string;
	    include: string[];
	    access_log: string;
	    error_log: string;
	}

	export interface LuciExt {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    listen: string[];
	    server_name: string;
	    include: string[];
	    access_log: string;
	    error_log: string;
	}

	export interface Nginx {
	    global: Global;
	    tekadom_ui: TekadomUi;
	    tekadom_ui_ext: TekadomUiExt;
	    luci: Luci2;
	    luci_ext: LuciExt;
	}

	export interface Cfg01e48a {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    ttylogin: string;
	    log_size: string;
	    urandom_seed: string;
	    compat_version: string;
	    desciption: string;
	    hostname: string;
	    description: string;
	    zonename: string;
	    timezone: string;
	    tekadom: string;
	    log_ip: string;
	    log_proto: string;
	    conloglevel: string;
	    cronloglevel: string;
	}

	export interface Ntp {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    server: string[];
	}

	export interface System {
	    cfg01e48a: Cfg01e48a;
	    ntp: Ntp;
	}

	export interface Cfg0102af {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	    affects: string[];
	}

	export interface Cfg02e233 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    affects: string[];
	}

	export interface Cfg03b57b {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	    affects: string[];
	}

	export interface Cfg04c845 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface Cfg05ad04 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	    affects: string[];
	}

	export interface Cfg06f057 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface Cfg074dd4 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface Cfg088cc9 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface Cfg09cd75 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    exec: string;
	}

	export interface Cfg0aa258 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface Cfg0be48a {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	    exec: string;
	    affects: string[];
	}

	export interface Cfg0c003c {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface Cfg0d804c {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface Cfg0e8036 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface Cfg0f0f89 {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface Cfg10822b {
	    .anonymous: boolean;
	    .type: string;
	    .name: string;
	    .index: number;
	    init: string;
	}

	export interface IUcitrackPackage  extends IPackageData{
	    cfg0102af: Cfg0102af;
	    cfg02e233: Cfg02e233;
	    cfg03b57b: Cfg03b57b;
	    cfg04c845: Cfg04c845;
	    cfg05ad04: Cfg05ad04;
	    cfg06f057: Cfg06f057;
	    cfg074dd4: Cfg074dd4;
	    cfg088cc9: Cfg088cc9;
	    cfg09cd75: Cfg09cd75;
	    cfg0aa258: Cfg0aa258;
	    cfg0be48a: Cfg0be48a;
	    cfg0c003c: Cfg0c003c;
	    cfg0d804c: Cfg0d804c;
	    cfg0e8036: Cfg0e8036;
	    cfg0f0f89: Cfg0f0f89;
	    cfg10822b: Cfg10822b;
	} */

	export type IWirelessDeviceSection = INamedSection<'wifi-device'> & {
		type?: 'mac80211' | option_data;
		path?: option_data;
		channel?: option_data;
		band?: '2g' | '5g';
		htmode?: option_data;
		country?: Uppercase<option_data>;
		disabled?: bool_data;
	};

	export type IWirelessIfaceSection = INamedSection<'wifi-iface'> & {
		device?: option_data;
		network?: option_data;
		mode?: 'ap' | option_data;
		ssid?: option_data;
		encryption?: 'psk2' | option_data;
		key?: option_data;
		disabled?: bool_data;
	};
	export type IWirelessPackage = IPackage & {
		[K: SectionName]: IWirelessDeviceSection | IWirelessIfaceSection;
	};

	export type IXinetdPackage = IPackage;

	export interface IConfigData {
		collectd?: ICollectdPackage;
		dhcp?: IDhcpPackage;
		network?: INetworkPackage;
		wireless?: IWirelessPackage;
		xinetd?: IXinetdPackage;
		rpcd?: IRpcdPackage;
		// dropbear?: IDropbearPackage;
		// firewall?: IFirewallPackage;
		// luci?: ILuciPackage;
		// mosquitto?: IMosquittoPackage;
		// mwan3?: IMwan3Package;
		// nginx?: INginxPackage;
		// system?: ISystemPackage;
		// ucitrack?: IUcitrackPackage;
	}
}
