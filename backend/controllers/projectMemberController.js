const ProjectMember = require('../models/projectMembers');
const User = require('../models/users');
const Project = require('../models/projects');
const sendMail = require('../services/emailSender');


module.exports = {


    // get all project members
    getAllProjectMembers: async (req, res) => {
        try {
            const projectMembers = await ProjectMember.findAll();
            res.status(200).json(projectMembers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // add project member
    addProjectMember: async (req, res) => {
        try {
            const { userId, projectId, role } = req.body;
            if (!userId || !projectId || !role) {
                return res.status(400).json({ message: 'User ID, Project ID and role are required.' });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found.' });
            }
            const projectMember = await ProjectMember.create({ userId, projectId, role });
            res.status(200).json(projectMember);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // update project member
    updateProjectMember: async (req, res) => {
        try {
            const { projectMemberId } = req.params;
            const { role } = req.body;
            const projectMember = await ProjectMember.findById(projectMemberId);
            if (!projectMember) {
                return res.status(404).json({ message: 'Project Member not found.' });
            }
            if(role)
                return res.status(400).json({ message: 'Role is required.' });
            projectMember.role = role;
            await projectMember.save();
            res.status(200).json(projectMember);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // delete project member
    deleteProjectMember: async (req, res) => {
        try {
            const { projectMemberId } = req.params;
            const projectMember = await ProjectMember.findById(projectMemberId);
            if (!projectMember) {
                return res.status(404).json({ message: 'Project Member not found.' });
            }
            await projectMember.destroy();
            res.status(200).json({ message: 'Project Member deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // get project members by project
    getProjectMembersByProject: async (req, res) => {
        try {
            const { projectId } = req.params;
            const projectMembers = await ProjectMember.findAllByProjectId(projectId);
            res.status(200).json(projectMembers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // get project members by user
    getProjectMembersByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const projectMembers = await ProjectMember.findAllByUserId(userId);
            res.status(200).json(projectMembers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

}