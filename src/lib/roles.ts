export type TestSection = {
  title: string;
  subtitle: string;
  minutes?: number;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  skills: string[];
  preview: {
    testTitle: string;
    durationMinutes: number;
    sections: TestSection[];
  };
};

export const ROLES: Role[] = [
  {
    id: "mechanical-design-engineer",
    name: "Mechanical Design Engineer",
    description: "CAD, DFM, materials, and tolerance-driven design.",
    skills: ["SolidWorks", "GD&T", "DFM/DFA", "Tolerance Analysis", "FEA"],
    preview: {
      testTitle: "Mechanical Design Engineer Hiring Test",
      durationMinutes: 120,
      sections: [
        {
          title: "CAD + Drawings (Intermediate)",
          subtitle: "1 Design-for-manufacturing question",
        },
        {
          title: "GD&T + Tolerancing (Intermediate)",
          subtitle: "1 Dimensional control question",
        },
      ],
    },
  },
  {
    id: "electrical-design-engineer",
    name: "Electrical Design Engineer",
    description: "Schematic-to-PCB, power, signal integrity, and EMC basics.",
    skills: ["Altium", "Schematic Capture", "Power", "EMI/EMC", "Debugging"],
    preview: {
      testTitle: "Electrical Design Engineer Hiring Test",
      durationMinutes: 105,
      sections: [
        {
          title: "Schematic Review (Intermediate)",
          subtitle: "1 Circuit reasoning question",
        },
        {
          title: "PCB + EMC (Basic)",
          subtitle: "1 Layout best-practices question",
        },
      ],
    },
  },
  {
    id: "firmware-engineer",
    name: "Firmware Engineer (Embedded)",
    description: "Bare-metal/RTOS C/C++, peripherals, and hardware bring-up.",
    skills: ["C/C++", "RTOS", "SPI/I2C/UART", "Drivers", "Debugging"],
    preview: {
      testTitle: "Firmware Engineer Hiring Test",
      durationMinutes: 90,
      sections: [
        {
          title: "Embedded C + Memory (Intermediate)",
          subtitle: "1 C + pointers question",
        },
        {
          title: "Peripherals + Debugging (Basic)",
          subtitle: "1 hardware bring-up question",
        },
      ],
    },
  },
  {
    id: "controls-automation-engineer",
    name: "Controls & Automation Engineer",
    description: "Closed-loop control, motion, and industrial automation.",
    skills: ["PID", "PLC", "Motion Control", "Sensors", "Commissioning"],
    preview: {
      testTitle: "Controls & Automation Engineer Hiring Test",
      durationMinutes: 100,
      sections: [
        {
          title: "Control Systems (Intermediate)",
          subtitle: "1 PID tuning question",
        },
        {
          title: "Sensors + I/O (Basic)",
          subtitle: "1 instrumentation question",
        },
      ],
    },
  },
  {
    id: "validation-test-engineer",
    name: "Validation & Test Engineer",
    description: "Reliability, verification planning, and test automation.",
    skills: ["Test Plans", "DAQ", "Root Cause", "Reliability", "Automation"],
    preview: {
      testTitle: "Validation & Test Engineer Hiring Test",
      durationMinutes: 75,
      sections: [
        {
          title: "Verification Planning (Intermediate)",
          subtitle: "1 requirements-to-test mapping question",
        },
        {
          title: "Failure Analysis (Basic)",
          subtitle: "1 debugging + root-cause question",
        },
      ],
    },
  },
];

