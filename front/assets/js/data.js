// Sample member data
const members = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Rakoto',
    role: 'Développeur Full Stack',
    email: 'jean.rakoto@example.com',
    phone: '+261 34 12 345 67',
    bio: 'Développeur passionné par les technologies web et mobile.',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    joinDate: '2022-01-15',
    image: 'placeholder-1.jpg'
  },
  {
    id: 2,
    firstName: 'Marie',
    lastName: 'Rasoa',
    role: 'Designer UI/UX',
    email: 'marie.rasoa@example.com',
    phone: '+261 32 98 765 43',
    bio: 'Designer créative spécialisée en expérience utilisateur.',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
    joinDate: '2021-11-03',
    image: 'placeholder-2.jpg'
  }
];

// Function to get all members
function getAllMembers() {
  return members;
}

// Function to get a single member by ID
function getMemberById(id) {
  return members.find(member => member.id === parseInt(id));
}

// Function to add a new member
function addMember(member) {
  const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
  const newMember = {
    ...member,
    id: newId,
    joinDate: new Date().toISOString().split('T')[0],
    image: `placeholder-${newId}.jpg`
  };
  members.push(newMember);
  return newMember;
}
