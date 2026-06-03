import prisma from "../prisma.js";

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    const project = await prisma.project.create({
      data: {
        name
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id
      },
      include: {
        testScenarios: {
          orderBy: {
            createdAt: "asc"
          }
        },
        testRuns: {
          orderBy: {
            createdAt: "desc"
          },
          include: {
            testResults: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createScenario = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, targetUrl, width, height } = req.body;

    const parsedWidth = Number(width);
    const parsedHeight = Number(height);
    if (!Number.isInteger(parsedWidth) || parsedWidth < 1 || !Number.isInteger(parsedHeight) || parsedHeight < 1) {
      return res.status(400).json({ error: "Width and height must be positive integers" });
    }

    const project = await prisma.project.findUnique({
      where: {
        id
      }
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const scenario = await prisma.testScenario.create({
      data: {
        projectId: id,
        name,
        targetUrl,
        width: Number(width),
        height: Number(height)
      }
    });

    res.status(201).json(scenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
