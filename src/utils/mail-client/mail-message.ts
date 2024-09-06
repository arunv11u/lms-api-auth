/* eslint-disable max-classes-per-file */
import Mail from "nodemailer/lib/mailer";
import { Readable } from "nodemailer/lib/xoauth2";


enum TemplateFolderNames {
	test = "test",
	welcome = "welcome",
	inviteUserToJoinOrganisation = "invite-user-to-join-organization",
	organisationSignup = "organisation-signup",
	sendOtp = "send-one-time-password",
	initSos = "init-sos",
	notifyCommitteeAboutNewComplaint = "notify-committee-about-new-complaint",
	submitConciliationRemarksToManagement = "submit-conciliation-remarks-to-management",
	notifyCommitteeAboutRespondentRepliedToAllegations = "notify-committee-about-respondent-replied-to-allegations",
	notifyCommitteeAboutInvestigationReportReview = "notify-committee-about-investigation-report-review",
	notifyManagementAboutInvestigationReportSubmission = "notify-management-about-investigation-report-submission",
	notifyCommitteeAboutComplaintClosure = "notify-committee-about-complaint-closure"
}

enum TemplateTypes {
	html = "HTML",
	subject = "SUBJECT",
	text = "TEXT"
}

class MailMessageFrom {
	address: string;
	name: string;
}

class MailMessageTo {
	address: string;
	name: string;
}

class MailMessage {
	from: string | MailMessageFrom;
	to: string | MailMessageTo | (string | MailMessageTo)[];
	subject: string;
	html: string | Buffer | Readable | Mail.AttachmentLike;
	text: string | Buffer | Readable | Mail.AttachmentLike;
	attachments: Mail.Attachment[];
	cc: string | Mail.Address | (string | Mail.Address)[];

	constructor(
		from: string | MailMessageFrom,
		to: string | MailMessageTo | (string | MailMessageTo)[]
	) {
		this.from = from;
		this.to = to;
	}
}

export {
	TemplateFolderNames,
	TemplateTypes,
	MailMessageFrom,
	MailMessageTo,
	MailMessage,
};