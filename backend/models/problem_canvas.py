from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Define question and answer packets
bullying_questions = [
    "Who is affected by the school bullying problem?",
    "What is school bullying?",
    "Where does bullying usually happen in school?",
    "Why is it important to stop bullying in school?",
    "Who can help stop bullying in school?",
    "What are the signs that someone is being bullied?",
    "Where should students go for help if they are being bullied?",
    "Why do some students bully others?",
    "Who benefits from a bullying-free school environment?",
    "What can happen if bullying is not addressed?"
]

bullying_answers = [
    "Students, teachers, parents",
    "Bullying is when someone repeatedly hurts or scares another person.",
    "Bullying usually happens in hallways, playgrounds, or online.",
    "It's important to stop bullying to make school a safe place for everyone.",
    "Teachers, school counselors, and parents can help stop bullying.",
    "Signs include unexplained injuries, lost belongings, and avoiding school.",
    "Students should go to a teacher or school counselor for help.",
    "Some students bully others because they want to feel powerful.",
    "Everyone benefits from a bullying-free school, especially the students.",
    "If bullying is not addressed, it can lead to serious emotional issues."
]

sports_questions = [
    "Who can participate in school sports teams?",
    "What are the benefits of playing sports?",
    "Where can students practice sports at school?",
    "Why is teamwork important in sports?",
    "Who coaches the school sports teams?",
    "What equipment is needed for playing basketball?",
    "Where are school sports competitions usually held?",
    "Why should students warm up before playing sports?",
    "Who are some famous athletes that students can look up to?",
    "What are the rules of soccer?"
]

sports_answers = [
    "All students can participate in school sports teams.",
    "Playing sports improves physical health, teaches teamwork, and boosts confidence.",
    "Students can practice sports in the gymnasium, on the sports field, or in the playground.",
    "Teamwork is important because it helps players work together to achieve a common goal.",
    "School sports teams are usually coached by physical education teachers or hired coaches.",
    "Basketball equipment includes a basketball, a hoop, and appropriate sportswear.",
    "School sports competitions are usually held in the school's gymnasium or sports field.",
    "Warming up helps prevent injuries and prepares the body for physical activity.",
    "Famous athletes include Michael Jordan, Serena Williams, and Lionel Messi.",
    "The rules of soccer include no hands except by the goalkeeper, scoring by getting the ball into the opposing goal, and playing within the field boundaries."
]

competitions_questions = [
    "Who can join school competitions?",
    "What types of competitions are held in schools?",
    "Where are spelling bees usually held?",
    "Why are academic competitions beneficial?",
    "Who organizes school science fairs?",
    "What are the prizes for winning school competitions?",
    "Where can students find information about upcoming competitions?",
    "Why is it important to prepare for competitions?",
    "Who judges the school art competitions?",
    "What are the rules for participating in a debate competition?"
]

competitions_answers = [
    "All students can join school competitions.",
    "Competitions include spelling bees, science fairs, math contests, and art contests.",
    "Spelling bees are usually held in the school auditorium or a large classroom.",
    "Academic competitions help students learn new skills, build confidence, and gain recognition.",
    "School science fairs are usually organized by science teachers and school staff.",
    "Prizes include trophies, medals, certificates, and sometimes scholarships.",
    "Students can find information on the school bulletin board, website, or from teachers.",
    "Preparing for competitions helps students perform better and feel more confident.",
    "Art teachers or guest artists usually judge school art competitions.",
    "Debate competition rules include following the topic, respecting time limits, and maintaining respectful conduct."
]

study_preparation_questions = [
    "Who can help students with their homework?",
    "What are effective study habits?",
    "Where is the best place to study at home?",
    "Why is it important to take breaks while studying?",
    "Who can students ask for extra help in subjects they find difficult?",
    "What materials are needed for effective studying?",
    "Where can students find additional learning resources?",
    "Why should students review their notes regularly?",
    "Who can form a study group?",
    "What are the benefits of studying with a group?"
]

study_preparation_answers = [
    "Parents, teachers, and tutors can help students with their homework.",
    "Effective study habits include setting a schedule, staying organized, and focusing on one task at a time.",
    "The best place to study at home is a quiet, well-lit area with minimal distractions.",
    "Taking breaks helps students stay focused and prevents burnout.",
    "Students can ask their teachers, classmates, or tutors for extra help.",
    "Materials needed include textbooks, notebooks, pens, highlighters, and a computer or tablet.",
    "Students can find additional resources in the library, online educational websites, or from their teachers.",
    "Reviewing notes regularly helps reinforce learning and improves memory retention.",
    "Any group of students can form a study group.",
    "Studying with a group can provide different perspectives, increase motivation, and make learning more enjoyable."
]

discipline_questions = [
    "Who enforces the school rules?",
    "What are the consequences of breaking school rules?",
    "Where can students learn about the school's code of conduct?",
    "Why is it important to follow school rules?",
    "Who can students talk to if they have concerns about school discipline?",
    "What should students do if they see someone breaking the rules?",
    "Where can students report incidents of misconduct?",
    "Why is punctuality important in school?",
    "Who decides on the disciplinary actions for serious offenses?",
    "What are some examples of good behavior in school?"
]

discipline_answers = [
    "Teachers, school staff, and the principal enforce the school rules.",
    "Consequences can include warnings, detention, suspension, or expulsion.",
    "Students can learn about the school's code of conduct in the student handbook or on the school website.",
    "Following school rules ensures a safe and respectful environment for everyone.",
    "Students can talk to their teachers, school counselors, or the principal.",
    "Students should report it to a teacher or school staff member.",
    "Students can report incidents to a teacher, school counselor, or through a school's anonymous reporting system.",
    "Punctuality shows respect for others' time and helps maintain an orderly schedule.",
    "The school administration or a disciplinary committee decides on actions for serious offenses.",
    "Good behavior includes respecting others, following instructions, and being honest."
]

# Case studies for data science
case_studies_questions = {
    "house_price_prediction": [
        "Who needs to know house price predictions?",
        "What factors influence house prices?",
        "Where can data about house prices be found?",
        "Why is predicting house prices important?"
    ],
    "student_performance_prediction": [
        "Who benefits from predicting student performance?",
        "What factors influence student performance?",
        "Where can data about student performance be found?",
        "Why is predicting student performance important?"
    ],
    "library_book_recommendation": [
        "Who benefits from book recommendations?",
        "What factors influence book recommendations?",
        "Where can data about reading preferences be found?",
        "Why are book recommendations important?"
    ],
    "school_event_attendance": [
        "Who benefits from predicting school event attendance?",
        "What factors influence event attendance?",
        "Where can data about past attendance be found?",
        "Why is predicting event attendance important?"
    ],
    "cafeteria_food_wastage": [
        "Who needs to know about food wastage predictions?",
        "What factors influence food wastage?",
        "Where can data about food wastage be found?",
        "Why is predicting food wastage important?"
    ]
}

case_studies_answers = {
    "house_price_prediction": [
        "Buyers, sellers, real estate agents",
        "Number of rooms, area, location",
        "Real estate websites, government databases",
        "To make informed decisions in the real estate market"
    ],
    "student_performance_prediction": [
        "Students, teachers, parents",
        "Study hours, attendance, participation",
        "School records, student surveys",
        "To provide targeted support and improve educational outcomes"
    ],
    "library_book_recommendation": [
        "Students, librarians",
        "Past borrowings, reading interests, demographic information",
        "Library records, student surveys",
        "To enhance the reading experience and encourage reading"
    ],
    "school_event_attendance": [
        "Event organizers, students, teachers",
        "Event type, promotion methods, past attendance",
        "School records, event feedback forms",
        "To plan better and allocate resources effectively"
    ],
    "cafeteria_food_wastage": [
        "Cafeteria managers, school administrators",
        "Menu items, number of students, weather conditions",
        "Cafeteria records, student surveys",
        "To reduce waste and manage resources efficiently"
    ]
}

# Aggregate all questions and answers
question_packets = {
    "bullying": bullying_questions,
    "sports": sports_questions,
    "competitions": competitions_questions,
    "study_preparation": study_preparation_questions,
    "discipline": discipline_questions,
    "house_price_prediction": case_studies_questions["house_price_prediction"],
    "student_performance_prediction": case_studies_questions["student_performance_prediction"],
    "library_book_recommendation": case_studies_questions["library_book_recommendation"],
    "school_event_attendance": case_studies_questions["school_event_attendance"],
    "cafeteria_food_wastage": case_studies_questions["cafeteria_food_wastage"]
}

answer_packets = {
    "bullying": bullying_answers,
    "sports": sports_answers,
    "competitions": competitions_answers,
    "study_preparation": study_preparation_answers,
    "discipline": discipline_answers,
    "house_price_prediction": case_studies_answers["house_price_prediction"],
    "student_performance_prediction": case_studies_answers["student_performance_prediction"],
    "library_book_recommendation": case_studies_answers["library_book_recommendation"],
    "school_event_attendance": case_studies_answers["school_event_attendance"],
    "cafeteria_food_wastage": case_studies_answers["cafeteria_food_wastage"]
}

def preprocess_text(text):
    return text.lower()

def calculate_similarity(user_response, stored_answer):
    vectorizer = TfidfVectorizer().fit_transform([user_response, stored_answer])
    vectors = vectorizer.toarray()
    cosine_sim = cosine_similarity(vectors)
    return cosine_sim[0, 1]

def analyze_responses(packet_name, question_index, user_response):
    user_response = preprocess_text(user_response)
    stored_answer = preprocess_text(answer_packets[packet_name][question_index])
    
    score = calculate_similarity(user_response, stored_answer)
    
    result = {
        "question": question_packets[packet_name][question_index],
        "stored_answer": answer_packets[packet_name][question_index],
        "user_response": user_response,
        "score": score
    }
    return result
