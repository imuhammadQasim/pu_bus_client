// University Operating Hours (24-hour format)
export const OPERATING_HOURS = {
  morning: { start: 7, end: 10, label: "Morning" },
  afternoon: { start: 12, end: 15, label: "Afternoon" },
  evening: { start: 16, end: 19, label: "Evening" },
};

export interface Waypoint {
  lat: number;
  lng: number;
  name: string;
}

export interface Route {
  id: number;
  name: string;
  desc: string;
  color: string;
  waypoints: Waypoint[];
  batches: string[];
  routeCoordinates?: { lat: number; lng: number }[];
}

export interface Location {
  name: string;
  lat: number;
  lng: number;
  info: string;
  address: string;
  image: string;
}

// Route Data with Real Lahore Coordinates
export const routes: Route[] = [
  {
    id: 1,
    name: "Route 1: Dharampura",
    desc: "Via Canal Road & Jail Road",
    color: "#ef4444",
    waypoints: [
      { lat: 31.49124295709786, lng: 74.29731155759698, name: "PU Transport Wing" },
      { lat: 31.495, lng: 74.305, name: "Quaid-e-Azam Campus" },
      { lat: 31.5035, lng: 74.318, name: "New Campus Bridge" },
      { lat: 31.509, lng: 74.325, name: "Faisal Town" },
      { lat: 31.515, lng: 74.332, name: "Canal Road Stop" },
      { lat: 31.521, lng: 74.338, name: "Garden Town" },
      { lat: 31.528, lng: 74.345, name: "Jail Road Underpass" },
      { lat: 31.535, lng: 74.356, name: "Barkat Market" },
      { lat: 31.542, lng: 74.368, name: "Thokar Niaz Baig" },
      { lat: 31.547, lng: 74.366, name: "Model Town Link" },
      { lat: 31.552650439870856, lng: 74.36484554409991, name: "Dharampura Terminal" },
    ],
    batches: ["morning", "afternoon", "evening"],
  },
  {
    id: 2,
    name: "Route 2: Ada Plot Route",
    desc: "Via Raiwind Road & Jubilee",
    color: "#3b82f6",
    waypoints: [
      { lat: 31.49124295709786, lng: 74.29731155759698, name: "PU Transport Wing" },
      { lat: 31.485, lng: 74.290, name: "Old Campus Gate" },
      { lat: 31.475, lng: 74.275, name: "Wahdat Road" },
      { lat: 31.465, lng: 74.260, name: "Allama Iqbal Town" },
      { lat: 31.455, lng: 74.245, name: "Jubilee Town" },
      { lat: 31.445, lng: 74.235, name: "Raiwind Road" },
      { lat: 31.435, lng: 74.225, name: "Township" },
      { lat: 31.425, lng: 74.215, name: "Muslim Town" },
      { lat: 31.415, lng: 74.205, name: "Akbar Chowk" },
      { lat: 31.405, lng: 74.195, name: "Liberty Market" },
      { lat: 31.395, lng: 74.185, name: "Mall Road" },
      { lat: 31.36396678367765, lng: 74.2344162295054, name: "Ada Plot Terminal" },
    ],
    batches: ["morning", "afternoon", "evening"],
  },
  {
    id: 3,
    name: "Route 3: Khatame Nabuwat Route",
    desc: "Via North Campus & Khatame Nabuwat",
    color: "#10b981",
    waypoints: [
      { lat: 31.49124295709786, lng: 74.29731155759698, name: "PU Transport Wing" },
      { lat: 31.49450, lng: 74.29200, name: "North Gate" },
      { lat: 31.49850, lng: 74.28950, name: "Lahore Fort Road" },
      { lat: 31.50250, lng: 74.28650, name: "Data Darbar" },
      { lat: 31.50650, lng: 74.28300, name: "Badshahi Mosque" },
      { lat: 31.51050, lng: 74.28000, name: "Shahi Hamam" },
      { lat: 31.51400, lng: 74.27900, name: "Walled City Stop" },
      { lat: 31.51733998322386, lng: 74.27747826915596, name: "Khatame Nabuwat Terminal" },
    ],
    batches: ["morning", "afternoon", "evening"],
  },
  {
    id: 4,
    name: "Route 4: Johar Town Route",
    desc: "Via Canal Bank Road & Johar Town",
    color: "#f59e0b",
    waypoints: [
      { lat: 31.49124295709786, lng: 74.29731155759698, name: "PU Transport Wing" },
      { lat: 31.488, lng: 74.310, name: "Canal Bank Road" },
      { lat: 31.485, lng: 74.320, name: "Thal Canal Bridge" },
      { lat: 31.480, lng: 74.330, name: "PCSIR" },
      { lat: 31.475, lng: 74.335, name: "Harbanspura" },
      { lat: 31.470, lng: 74.340, name: "Shadman Colony" },
      { lat: 31.465, lng: 74.345, name: "Johar Town Phase 1" },
      { lat: 31.460, lng: 74.350, name: "Johar Town Phase 2" },
      { lat: 31.455, lng: 74.355, name: "Johar Town Phase 3" },
      { lat: 31.450, lng: 74.358, name: "Wapda Town" },
      { lat: 31.39933384835247, lng: 74.36158930331601, name: "Johar Town Terminal" },
    ],
    batches: ["morning", "afternoon", "evening"],
  },
  {
    id: 5,
    name: "Route 5: Gujranwala Road Route",
    desc: "Via Gujranwala Road & Northern Bypass",
    color: "#8b5cf6",
    waypoints: [
      { lat: 31.49124295709786, lng: 74.29731155759698, name: "PU Transport Wing" },
      { lat: 31.500, lng: 74.295, name: "Gujranwala Road Junction" },
      { lat: 31.510, lng: 74.292, name: "Barkat Market" },
      { lat: 31.520, lng: 74.288, name: "Chauburji" },
      { lat: 31.530, lng: 74.285, name: "LDA Avenue" },
      { lat: 31.540, lng: 74.282, name: "Northern Bypass" },
      { lat: 31.550, lng: 74.280, name: "Sundar Industrial Estate" },
      { lat: 31.560, lng: 74.278, name: "Gulshan-e-Ravi" },
      { lat: 31.570, lng: 74.276, name: "Raiwind Road Junction" },
      { lat: 31.580, lng: 74.274, name: "Shalimar Link Road" },
      { lat: 31.590, lng: 74.272, name: "Baghbanpura" },
      { lat: 31.600, lng: 74.270, name: "Chungi Amar Sidhu" },
      { lat: 31.610, lng: 74.268, name: "Kamahan" },
      { lat: 31.620, lng: 74.266, name: "Bhuchokie" },
      { lat: 31.630, lng: 74.264, name: "Chak Jhumra" },
      { lat: 31.640, lng: 74.262, name: "Nankana Sahib Road" },
      { lat: 31.650, lng: 74.260, name: "Wan Radha Ram" },
      { lat: 31.658731110064455, lng: 74.28185255054493, name: "Gujranwala Road Terminal" },
    ],
    batches: ["morning", "afternoon", "evening"],
  },
  {
    id: 6,
    name: "Route 6: Sheikhupura Road Route",
    desc: "Via Sheikhupura Road & Motorway Access",
    color: "#ec4899",
    waypoints: [
      { lat: 31.49124295709786, lng: 74.29731155759698, name: "PU Transport Wing" },
      { lat: 31.495, lng: 74.290, name: "Sheikhupura Road Junction" },
      { lat: 31.500, lng: 74.280, name: "Ichhra" },
      { lat: 31.510, lng: 74.270, name: "Samanabad" },
      { lat: 31.520, lng: 74.260, name: "Lahore Ring Road" },
      { lat: 31.530, lng: 74.250, name: "Kot Abdul Malik" },
      { lat: 31.540, lng: 74.240, name: "Chah Miran" },
      { lat: 31.550, lng: 74.230, name: "Muridke Road" },
      { lat: 31.560, lng: 74.220, name: "Bhai Pheru" },
      { lat: 31.570, lng: 74.210, name: "Kala Shah Kaku" },
      { lat: 31.580, lng: 74.200, name: "Chunian" },
      { lat: 31.590, lng: 74.190, name: "Pattoki Road" },
      { lat: 31.600, lng: 74.180, name: "Harbanspura" },
      { lat: 31.610, lng: 74.170, name: "Mananwala" },
      { lat: 31.620, lng: 74.160, name: "Bukhari" },
      { lat: 31.630, lng: 74.150, name: "Warburton" },
      { lat: 31.640, lng: 74.140, name: "Farooqabad" },
      { lat: 31.650, lng: 74.130, name: "Muridke" },
      { lat: 31.660, lng: 74.120, name: "Sheikhupura Bypass" },
      { lat: 31.670, lng: 74.110, name: "M-2 Motorway Interchange" },
      { lat: 31.680, lng: 74.100, name: "Ferozewala" },
      { lat: 31.690, lng: 74.090, name: "Safa Textile Mills" },
      { lat: 31.700, lng: 74.080, name: "Sheikhupura Industrial Area" },
      { lat: 31.71057847256802, lng: 73.9953546628767, name: "Sheikhupura Road Terminal" },
    ],
    batches: ["morning", "afternoon", "evening"],
  },
];

// Campus Data with Real Coordinates
export const campuses: Location[] = [
  {
    name: "Department of Gender Studies",
    lat: 31.49572873662415,
    lng: 74.29423081315865,
    info: "Department of Gender Studies.",
    address: "University of the Punjab, Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxW4hSco0Tph5fOVszIk_uSeqnxBMtuJ0P9YRfq2RUrk7BYpjHhjzy3S4v5_03j8QiQSqky7GJ_NgZ7gQbgbuDWvAQRcLTU0V_2m63ZnMinaHURY23B56onACTtzz3afbbyjUQu=w288-h114-p-k-no"
  },
  {
    name: "School of Economics PU",
    lat: 31.50280571894848,
    lng: 74.3075985425132,
    info: "School of Economics PU.",
    address: "University of the Punjab, Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwEBWqFycgN7yPZpxusXkhgLlIhujNcgQtR6-P-cTL7BV59FRqirRaKqZd-hHX8JavxtziIeFXB5MSXwKy36qqmrvfSEy1iCgsU0amZ32VFAVFq6IMffX2KTGIkLJ0iAy05kXMK-g=w288-h114-p-k-no"
  },
  {
    name: "Department of Elementary Education",
    lat: 31.503994894453516,
    lng: 74.30944390230988,
    info: "Department of Elementary Education.",
    address: "G835+HQ4, Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "Institute of Electrical Electronics and Computer Engineering",
    lat: 31.500299994069707,
    lng: 74.30476297826284,
    info: "Institute of Electrical Electronics and Computer Engineering",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwiHe3hnh4JN4sVbRjwCLBjoPZuQrpWUydk186YxJIAMtDe0xG1KX0ozgLq3SnXFysNGaDiGX7VjxzqwVMZ7D_RsJG0pARzMQGceZ7RBDdet_9bkH7B6BGO8bTKnfp7r-6yTsN4=w288-h114-p-k-no"
  },
  {
    name: "Department of Political Science",
    lat: 31.502918708192517,
    lng: 74.30748330783867,
    info: "Department of Political Science.",
    address: "G834+4XP, Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzsrHGxaAfWFmMdCz2TGjJRfuq8kdex0J3L1EtLLcU6usttpECxeHmOw5U77zKYXVoGR2BLkVfL-Ulhs0fPYcril_ET-x7KOBaRCDPzi-K4TrehCSiOXEFr2RGg3dKZ2KjYSJb9=w288-h114-p-k-no"
  },
  {
    name: "Institute of Chemical Engineering & Technology, PU",
    lat: 31.500778156798596,
    lng: 74.30579888058399,
    info: "Institute of Chemical Engineering & Technology, PU.",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyf8P7XulvRRkTo4MmV2yhnd1MIO5Rv34LjHBjew4gHlCBU6pAlE9FGrpp1_RSRLY0SY55nSsY_T6gMVm4nt3Z7Aat9zzEZqAa95TowW8_fsQMDJPhSwx10EKszeERv4F0hmng7Hw=w288-h114-p-k-no"
  },
  {
    name: "CHEP (Centre for High Energy Physics)",
    lat: 31.502552805439862,
    lng: 74.30555211735599,
    info: "CHEP (Centre for High Energy Physics)",
    address: "G834+257, Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxDnRRNRSN8C8veyfVJvxNiM9b2bzEig-p3DBLswYjVTfAXpGNSI5G8PyCZ7jZWfqYojjQWjb8t0ftpxV8p04TsGw8-ynz094DZP4xdKdEHAtXs_kbiDFURSjNCbYBhrVKb7g0=w408-h306-k-no"
  },
  {
    name: "Cell and Molecular Biology Lab",
    lat: 31.501592303915242,
    lng: 74.30682884883558,
    info: "Cell and Molecular Biology Lab, Institute of Zoology, University of the Punjab",
    address: "G824+JM8, Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSw5R1WC21NCE47V0V2AQOWCJMh_HPMlltb5icSzd03_AQKgbVBGrdIm0hYXEVWN07UG0038FivDcSc9I5Cajtq3UZDMMLXebecQ-c_btIi5p7BWZWY4yy9qGY3IvOZ2u3LSApdwnv4Swlvf=w330-h114-p-k-no"
  },
  {
    name: "School Of Biochemistry & Biotechnology",
    lat: 31.5022875250473,
    lng: 74.30476891231734,
    info: "School Of Biochemistry & Biotechnology",
    address: "Institute of Agricultural Sciences, Punjab University, Lahore",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzbJ8cV2_I-WFSPIy6rKlSm3isgh9quaU1HDzUI1hhF8nD8SvP39UA08QMjTKLpsJcgyebAD4fIReXX4erANAaPETanINcb3w4p4BoI99FUGbZlpdc9Py67IPL_BykOY_AmzDns=w288-h114-p-k-no"
  },
  {
    name: "Hailey College of Commerce",
    lat: 31.497027499793482,
    lng: 74.30310594271828,
    info: "Hailey College of Commerce",
    address: "Department of Botany, Punjab University, Lahore",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzlyARy9iJxQqhUlCK-8pPm4CXo2J1VlvChL_iJ0WtQuDes_jhvVR4ZviRGP8U_mpnzyaFMAJIadb_-BRow6398xaiSKNKuHXd5hiP8xtbBJS7Rvv9DQraQWQwWA6qjKura-3XF=w288-h114-p-k-no"
  },
  {
    name: "Department of Space Sciences",
    lat: 31.49417324049651,
    lng: 74.29309593869212,
    info: "Zoological research and wildlife conservation studies.",
    address: "University Of The Punjab, Quaid e Azam Campus, 53720, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSy4OI2dZMC8zkJ8x8nX6onLi2Emzd1NbQAlbCkl_2SuLN08hjDS3ph9SmN4uckkOjoeAZCbJqwC2KfTuia0SmBHLWq-6V_FKXxdj1Urn44JC3cTYkNXGltJUXHOhUpq5D-RSanY=w288-h114-p-k-no"
  },
  {
    name: "Institute of English Studies",
    lat: 31.495170980375864,
    lng: 74.29992596550278,
    info: "Institute of English Studies",
    address: "Jannat Rd, Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyloRyxsuG5Y4xWm-wDy2JLc64Xxul_Zb8PcKJoh1HRJmkFBTw0x6T4kZHnnt1Lds49ykoaaiptouUnNRr05M_0nI4IeI7Z25EfekVkanRfEoMvxqe4_NaBbO6TDyN_t8-5DXk=w288-h114-p-k-no"
  },
  {
    name: "Institute of Administrative Sciences",
    lat: 31.49448485468987,
    lng: 74.29840247078477,
    info: "Main university library with extensive collection of books and digital resources.",
    address: "F7VX+P8P Institute of Administrative Sciences, Canal Rd, Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxg8ZfVtiQeDoFnbh1Cr6qpyW0JaKlwuMltRkOsjogANbUE_yMYYcwX6waXlFinNnNRP5MEBs8ut8QGDVmAD_kdrFmiJDuglVCRkW2QjpPCsTc9OWmwqbEB9Xy25atSUqNHeT--=w288-h114-p-k-no"
  }
];

export const hostels: Location[] = [
  {
    name: "Boys Hostel A",
    lat: 31.492,
    lng: 74.295,
    info: "Boys Hostel A with modern facilities.",
    address: "Near Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "Girls Hostel B",
    lat: 31.494,
    lng: 74.297,
    info: "Girls Hostel B with comfortable accommodations.",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "International Hostel",
    lat: 31.496,
    lng: 74.299,
    info: "International Hostel for foreign students.",
    address: "University of the Punjab, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "Faculty Residence",
    lat: 31.498,
    lng: 74.301,
    info: "Residence for faculty members.",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "Guest House",
    lat: 31.500,
    lng: 74.303,
    info: "Guest House for visitors.",
    address: "University of the Punjab, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  }
];

export const grounds: Location[] = [
  {
    name: "Cricket Ground",
    lat: 31.493,
    lng: 74.296,
    info: "Main cricket ground for sports activities.",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "Football Field",
    lat: 31.495,
    lng: 74.298,
    info: "Football field for matches and training.",
    address: "University of the Punjab, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "Basketball Court",
    lat: 31.497,
    lng: 74.300,
    info: "Basketball court with modern facilities.",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "Tennis Court",
    lat: 31.499,
    lng: 74.302,
    info: "Tennis court for recreational activities.",
    address: "University of the Punjab, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "Gymnasium",
    lat: 31.501,
    lng: 74.304,
    info: "Indoor gymnasium for fitness.",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  }
];

export const gates: Location[] = [
  {
    name: "Main Gate",
    lat: 31.490,
    lng: 74.294,
    info: "Main entrance to the university.",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "North Gate",
    lat: 31.492,
    lng: 74.296,
    info: "North gate entrance.",
    address: "University of the Punjab, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "South Gate",
    lat: 31.494,
    lng: 74.298,
    info: "South gate entrance.",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "East Gate",
    lat: 31.496,
    lng: 74.300,
    info: "East gate entrance.",
    address: "University of the Punjab, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  },
  {
    name: "West Gate",
    lat: 31.498,
    lng: 74.302,
    info: "West gate entrance.",
    address: "Quaid-i-Azam Campus, Lahore, Pakistan",
    image: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
  }
];
