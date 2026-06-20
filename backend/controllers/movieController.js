import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';

export const getDashboardData = async (req, res) => {
    try {
        const movies = await Movie.find({});
        const theaters = await Theater.find({});
        res.status(200).json({ movies, theaters });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const seedDatabase = async (req, res) => {
    try {
        await Movie.deleteMany({});
        await Theater.deleteMany({});

        const sampleMovies = [
            {
                title: "Cocktail 2",
                // Beautiful Italian/Sicily coast vibe for the Rom-Com
                banner: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80", 
                description: "A Gen Z rom-com with a millennial soul. A woman enlists a one-time hostel roomie to test her partner's loyalty, setting off a chain of uncharted adventures and complicated love triangles in Sicily.",
                status: "Now Showing",
                formats: ["2D"],
                cast: [
                    { name: "Shahid Kapoor", role: "Kunal", image: "https://randomuser.me/api/portraits/men/11.jpg" },
                    { name: "Kriti Sanon", role: "Ally", image: "https://randomuser.me/api/portraits/women/12.jpg" },
                    { name: "Rashmika Mandanna", role: "Diya", image: "https://randomuser.me/api/portraits/women/14.jpg" }
                ]
            },
            {
                title: "Obsession",
                // Dark, shadowy psychological thriller vibe
                banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80", 
                description: "A psychological thriller that blurs the line between love and madness. A successful architect's life completely unravels when a mysterious, dangerously alluring stranger forces her way into his world.",
                status: "Now Showing",
                formats: ["2D", "Dolby Audio"],
                cast: [
                    { name: "Vicky Kaushal", role: "Arjun", image: "https://randomuser.me/api/portraits/men/33.jpg" },
                    { name: "Triptii Dimri", role: "Maya", image: "https://randomuser.me/api/portraits/women/35.jpg" }
                ]
            },
            {
                title: "Alpha",
                // High-octane female spy aesthetic
                banner: "https://images.unsplash.com/photo-1616012480717-fd9867059ca0?w=800&q=80", 
                description: "The highly anticipated next chapter in the YRF Spy Universe. An assassin raised under a mysterious programme finds herself confronting the very forces that created her, allying with an enigmatic partner.",
                status: "Coming Soon",
                formats: ["2D", "IMAX"],
                cast: [
                    { name: "Alia Bhatt", role: "Sita", image: "https://randomuser.me/api/portraits/women/41.jpg" },
                    { name: "Sharvari", role: "Agent", image: "https://randomuser.me/api/portraits/women/44.jpg" },
                    { name: "Bobby Deol", role: "Fateh", image: "https://randomuser.me/api/portraits/men/45.jpg" }
                ]
            },
            {
                title: "Spider-Man: Brand New Day",
                // Moody, red/blue neon city crawler vibe
                banner: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&q=80", 
                description: "Fighting crime full-time in a world that doesn't remember him, Peter Parker faces a shocking new threat to the city and a powerful villain no one can even see.",
                status: "Coming Soon",
                formats: ["2D", "3D", "IMAX"],
                cast: [
                    { name: "Tom Holland", role: "Peter Parker", image: "https://randomuser.me/api/portraits/men/51.jpg" },
                    { name: "Zendaya", role: "MJ", image: "https://randomuser.me/api/portraits/women/55.jpg" },
                    { name: "Sadie Sink", role: "Gwen Stacy", image: "https://randomuser.me/api/portraits/women/58.jpg" }
                ]
            }
        ];

        const sampleTheaters = [
            {
                name: "PVR Directors Cut",
                location: "Ambience Mall, New Delhi",
                basePrice: 450,
                schedules: [
                    { time: "12:00 PM", format: "IMAX", occupiedSeats: ["B-4", "B-5", "C-8"] },
                    { time: "04:30 PM", format: "2D", occupiedSeats: ["E-1", "E-2"] },
                    { time: "09:00 PM", format: "Dolby Audio", occupiedSeats: [] }
                ]
            },
            {
                name: "INOX Insignia",
                location: "Galleria Mall, Gurugram",
                basePrice: 380,
                schedules: [
                    { time: "10:30 AM", format: "2D", occupiedSeats: ["A-10", "A-11"] },
                    { time: "03:15 PM", format: "IMAX", occupiedSeats: ["K-5", "K-6", "K-7"] },
                    { time: "08:45 PM", format: "2D", occupiedSeats: [] }
                ]
            },
            {
                name: "Cinepolis VIP",
                location: "DLF Avenue, Saket",
                basePrice: 520,
                schedules: [
                    { time: "11:15 AM", format: "2D", occupiedSeats: [] },
                    { time: "06:00 PM", format: "3D", occupiedSeats: ["D-5", "D-6"] }
                ]
            }
        ];

        await Movie.insertMany(sampleMovies);
        await Theater.insertMany(sampleTheaters);

        res.status(201).json({ message: "Database Seeded successfully with updated data!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};