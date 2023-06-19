import os
import subjectRandom
import linkRandom

f = open('./templates/official/content.html', 'wb')

def getSubjectHeader():
    subject = subjectRandom.getRandomSubject(1)
    return subject
def getRandomLink():
    link = linkRandom.getRandomLink()
    return link
