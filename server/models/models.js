const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Убедитесь, что путь правильный

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    passwordHash: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "MENTEE" },
    course: { type: DataTypes.SMALLINT, allowNull: true },
    recordBookNumber: { type: DataTypes.INTEGER, unique: true, allowNull: true },
    facultyId: { type: DataTypes.INTEGER, allowNull: true},
    specializationId: { type: DataTypes.INTEGER, allowNull: true },
    avatar: { type: DataTypes.STRING, allowNull: true }, // Поле для аватара
});

const Faculty = sequelize.define('faculty', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

const Specialization = sequelize.define('specialization', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

const Contacts = sequelize.define('contacts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vk: { type: DataTypes.STRING, allowNull: true },
    telegram: { type: DataTypes.STRING, allowNull: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }
});

const MentorReview = sequelize.define('mentorReview', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fromUserId: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.STRING, allowNull: true },
    rating: { type: DataTypes.FLOAT, allowNull: false },
    mentorshipSessionId: { type: DataTypes.INTEGER, allowNull: false }
});

const MenteeReview = sequelize.define('menteeReview', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fromUserId: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.STRING, allowNull: true },
    rating: { type: DataTypes.FLOAT, allowNull: false },
    mentorshipSessionId: { type: DataTypes.INTEGER, allowNull: false }
});

const MentorshipSession = sequelize.define('mentorshipSession', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    scheduledTime: { type: DataTypes.DATE, allowNull: false },
    isFinished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    mentorId: { type: DataTypes.INTEGER, allowNull: false },
    menteeId: { type: DataTypes.INTEGER, allowNull: false },
});

const Post = sequelize.define('post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    forumId: { type: DataTypes.INTEGER, allowNull: false },
});

const Forum = sequelize.define('forum', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
});

const Tag = sequelize.define('tags', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
});

const Resource = sequelize.define('resource', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    filePath: { type: DataTypes.STRING, allowNull: false },
    fileType: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
});

// Определение связей
User.belongsTo(Faculty, { foreignKey: 'facultyId' });
Faculty.hasMany(User, { foreignKey: 'facultyId' });

User.belongsTo(Specialization, { foreignKey: 'specializationId' });
Specialization.hasMany(User, { foreignKey: 'specializationId' });

User.hasOne(Contacts, { foreignKey: 'userId', as: 'contacts' });
Contacts.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Resource, { foreignKey: 'userId', as: "resources" });
Resource.belongsTo(User, { foreignKey: 'userId', as: "author" });

User.hasMany(Tag, { foreignKey: 'userId' });
Tag.belongsTo(User, { foreignKey: 'userId' });

Forum.hasMany(Post, { foreignKey: 'forumId' });
Post.belongsTo(Forum, { foreignKey: 'forumId' });

Post.belongsTo(User, { foreignKey: 'authorId' });
User.hasMany(Post, { foreignKey: 'authorId' });

MentorshipSession.belongsTo(User, {
    foreignKey: 'mentorId',
    as: 'mentor'
});
MentorshipSession.belongsTo(User, {
    foreignKey: 'menteeId',
    as: 'mentee'
});
User.hasMany(MentorshipSession, {
    foreignKey: 'mentorId',
    as: 'mentoringSessions'
});
User.hasMany(MentorshipSession, {
    foreignKey: 'menteeId',
    as: 'learningSessions'
});

User.hasMany(MentorReview, { foreignKey: 'fromUserId' });
MentorReview.belongsTo(User, { foreignKey: 'fromUserId' });
MentorReview.belongsTo(MentorshipSession, { foreignKey: 'mentorshipSessionId' }); // Исправление

User.hasMany(MenteeReview, { foreignKey: 'fromUserId' });
MenteeReview.belongsTo(User, { foreignKey: 'fromUserId' });
MenteeReview.belongsTo(MentorshipSession, { foreignKey: 'mentorshipSessionId' }); // Исправление

module.exports = {
    User,
    Faculty,
    Specialization,
    Contacts,
    MenteeReview,
    MentorReview,
    Resource,
    MentorshipSession,
    Post,
    Forum,
    Tag,
};
