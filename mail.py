#!/usr/bin/python3

import cgi, cgitb
from configparser import SafeConfigParser
import email
from email.header import Header as email_Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
import logging
import json
import smtplib
from string import Template
import sys


# touch mail.log; chmod o+w mail.log
logging.basicConfig(
	filename='mail.log',
	level=logging.DEBUG,
	format='%(asctime)s %(message)s',
	datefmt='%m/%d/%Y %I:%M:%S %p'
)

# get settings
settings = SafeConfigParser()
settings.readfp(open('../settings.cfg'))

# mail obj
class mailSession:
	def __init__(self):
		self.smtp_host = settings.get('smtp','host')
		self.smtp_user = settings.get('smtp','name')
		self.smtp_pass = settings.get('smtp','pass')
		self.sender_name = settings.get('smtp','name_pretty')
		self.recipients = settings.get('smtp','recipients').split(',')
		self.connect()

	def connect(self):
		self.server = smtplib.SMTP(self.smtp_host, 587)
		self.server.starttls()
		self.server.login(self.smtp_user, self.smtp_pass)

	def send(self, html_msg="This is a <b>test</b> message!", reply_to=None):

		if reply_to is None:
			reply_to = self.smtp_user

		msg = MIMEMultipart('alternative')

		author = email.utils.formataddr((str(email_Header(self.sender_name, 'utf-8')), reply_to))
		msg['From'] = author
		msg['Subject'] = 'RSVP Alert!'
		msg['To'] = self.recipients[0]

		msg.attach(MIMEText(html_msg, 'html'))

		self.server.sendmail(reply_to, self.recipients, msg.as_string())
		self.server.quit()

		logging.info('RSVP email alert sent successfully!')


#request obj
class requestObject:
	def __init__(self):
		self.post_body = json.load(sys.stdin)
		self.validate()
		self.guests = self.post_body['guests']
		self.meta = self.post_body['meta']
		logging.info("New request from %s" % self.meta['user_agent'])
		logging.info("Request includes %s guest(s)" % len(self.guests))

	def validate(self):
		if not 'meta' in self.post_body.keys():
			return False
		if not 'guests' in self.post_body.keys():
			return False

	def send_email(self):

		contact_email = None
		if 'confirmation_email' in self.meta.keys():
			contact_email = self.meta['confirmation_email']

		template = Template(open('html/email.html', 'r').read())

		guest_table_html = ""
		for guest in self.guests:
			guest_table_html += "<tr><td>%s</td><td>%s</td><td>%s</td></tr>\n" % (guest['name'], guest['type'], guest['meal'])

		body =	template.safe_substitute(
			guestCount = len(self.guests),
			guestRows = guest_table_html,
			userAgent = self.meta['user_agent'],
			contactEmail = contact_email,
			dateStamp = datetime.now()
		)

		M = mailSession()
		M.connect()
		if settings.getboolean("smtp","armed"):
			M.send(body, contact_email)
		else:
			logging.warn("RSVP email was NOT sent: application is not armed!")

	def render_response(self):
		print("Content-type: application/json\n\n")
		result = {'success':True,'message':'RSVP accepted!'};
		print(json.dumps(result))




if __name__ == '__main__':
	cgitb.enable
	R = requestObject()
	R.send_email()
	R.render_response()
	sys.exit()
