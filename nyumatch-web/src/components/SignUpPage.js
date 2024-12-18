import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso",
    "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic (Czechia)",
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Eswatini (formerly Swaziland)", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland",
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
    "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kosovo",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Macedonia (formerly Macedonia)", "Norway", "Oman", "Pakistan", "Palau", "Palestine State",
    "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe"
];

const SignUpPage = () => {
    const { userData, setUserData } = useContext(UserContext);
    const [major, setMajor] = useState('');
    const [residency, setResidency] = useState('');
    const [gender, setGender] = useState('');
    const [socialGoal, setSocialGoal] = useState('');
    const [personalityType, setPersonalityType] = useState('');
    const [nationality, setNationality] = useState('');
    const [somethingAboutMe, setSomethingAboutMe] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!major || !residency || !gender || !socialGoal || !personalityType || !nationality || !somethingAboutMe) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const userDataToUpdate = {
                email: userData.email,
                major,
                residency,
                gender,
                socialGoal,
                personalityType,
                nationality,
                somethingAboutMe,
            };

            const response = await axios.post('http://127.0.0.1:5000/signup', userDataToUpdate);
            console.log('User signed up successfully:', response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Sign up failed:', error);
            setError('Failed to sign up. Please try again.');
        }
    };

    return (
        <div className="container">
          <div className="card">
            <h1 className="heading">Sign Up</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
                className="input"
              />
              <select
                value={residency}
                onChange={(e) => setResidency(e.target.value)}
                required
                className="select"
              >
                <option value="" disabled>Select Residency</option>
                <option value="Jersey City">Jersey City</option>
                <option value="Manhattan">Manhattan</option>
                <option value="LIC">LIC</option>
                <option value="Brooklyn">Brooklyn</option>
              </select>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="select"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                value={socialGoal}
                onChange={(e) => setSocialGoal(e.target.value)}
                required
                className="select"
              >
                <option value="" disabled>Select Social Goal</option>
                <option value="Study Partner">Study Partner</option>
                <option value="People with same hobbies">People with same hobbies</option>
                <option value="Meet more people to hangout with">Meet more people to hangout with</option>
              </select>
              <select
                value={personalityType}
                onChange={(e) => setPersonalityType(e.target.value)}
                required
                className="select"
              >
                <option value="" disabled>Select Personality Type</option>
                <option value="Introvert">Introvert</option>
                <option value="Extrovert">Extrovert</option>
              </select>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                required
                className="select"
              >
                <option value="" disabled>Select Nationality</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Something About Me"
                value={somethingAboutMe}
                onChange={(e) => setSomethingAboutMe(e.target.value)}
                required
                className="input"
              />
              <button type="submit" className="button" style={{ display: 'block', margin: '30px auto 0' }}>Sign Up</button>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      );
    };
    
 export default SignUpPage;