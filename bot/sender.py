import smtplib
import time
import random
import subjectRandom

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send():
    sender = "insert sender email"
    recipient = raw_input("Enter the email of recipient: ")
    p_reader = open('password.txt', 'rb') # edit for your password
    cipher = p_reader.read()

    thread_number = random.randint(0, 10000)

    #read html file
    message_reader = open('finalMessage.html', 'rb')
    finalMessage = message_reader.read()

    #get subject
    subject = subjectRandom.getRandomSubject(0)

    msg = MIMEMultipart('alternative')
    #msg['Subject'] = "Waylon Bot Message Test " + str(thread_number)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    text = "This is a test message"
    html = finalMessage

    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')

    msg.attach(part1)
    msg.attach(part2)

    s = smtplib.SMTP(host='smtp.gmail.com', port=587)
    s.ehlo()
    s.starttls()
    s.ehlo()
    s.login(sender, cipher)
    s.sendmail(sender, recipient, msg.as_string())

    print ("Email sent!")
    s.quit()

send();

