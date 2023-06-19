import os
import subjectRandom
import linkRandom

f = open('./templates/hero/content.html', 'wb')

def getSubjectHeader():
    subject = subjectRandom.getRandomSubject(0)
    return subject
def getRandomLink():
    link = linkRandom.getRandomLink()
    return link
