/* =========================================================================
   NOTIFICATIONS E-MAIL — DigitalVerse (nodemailer + Gmail SMTP)
   Config via variables d'environnement :
     SMTP_USER      Adresse Gmail d'expédition (ex. agence.digitalverse@gmail.com)
     SMTP_PASS      Mot de passe d'application Gmail (16 caractères,
                    myaccount.google.com/apppasswords — 2FA requise)
     SMTP_HOST      (optionnel, défaut smtp.gmail.com)
     SMTP_PORT      (optionnel, défaut 587)
     NOTIFY_EMAIL   Adresse qui reçoit les notifications admin (défaut = SMTP_USER)
     MAIL_FROM      (optionnel, ex. "Agence DigitalVerse <agence@…>")
   Sans configuration : les envois sont simplement ignorés (rien ne casse).
   ========================================================================= */
import nodemailer from 'nodemailer';
import { PLANS, BRAND } from '../config/site.config.js';

function smtpConfig() {
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || '').replace(/\s/g, ''); // Gmail affiche le mot de passe par blocs de 4
  if (!user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user, pass },
  };
}

export async function sendMail({ to, subject, html, text }) {
  const cfg = smtpConfig();
  if (!cfg) {
    console.info('[mail] SMTP non configuré — envoi ignoré (', subject, ')');
    return { sent: false, reason: 'smtp_disabled' };
  }
  try {
    const transporter = nodemailer.createTransport(cfg);
    const from = process.env.MAIL_FROM || `DigitalVerse <${cfg.auth.user}>`;
    await transporter.sendMail({ from, to, subject, html, text });
    console.info('[mail] envoyé →', to, '—', subject);
    return { sent: true };
  } catch (e) {
    console.error('[mail] échec d’envoi :', e.message);
    return { sent: false, reason: e.message };
  }
}

/* ---------------------------------------------------------- modèles d'e-mail */
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function layout(title, content, footerNote) {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 12px;">
    <div style="background:#0c0c0d;border:1px solid #262628;border-radius:16px;overflow:hidden;">
      <div style="padding:20px 28px;border-bottom:1px solid #262628;">
        <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">Digital<span style="color:#f20d25;">Verse</span></span>
      </div>
      <div style="padding:28px;">
        <h1 style="color:#ffffff;font-size:19px;margin:0 0 16px;">${title}</h1>
        ${content}
      </div>
    </div>
    <p style="color:#7a7a7c;font-size:12px;text-align:center;padding:16px 0 0;line-height:1.6;">
      ${footerNote || 'DigitalVerse — Websites / AI / Automation'}
    </p>
  </div>
</body></html>`;
}

function row(label, value) {
  return `<tr>
    <td style="padding:7px 0;color:#8a8a8c;font-size:13px;vertical-align:top;width:150px;">${label}</td>
    <td style="padding:7px 0;color:#ffffff;font-size:14px;">${value}</td>
  </tr>`;
}

function button(url, label) {
  return `<div style="text-align:center;margin:24px 0 8px;">
    <a href="${url}" style="display:inline-block;background:#f20d25;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 34px;border-radius:10px;">${label}</a>
  </div>`;
}

/* ----------------------------------------------------- notification ADMIN */
export function notifyAdminNewOrder(order, origin) {
  const plan = PLANS[order.planSlug] || {};
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  const chatUrl = `${origin}/chat/${order.id}?key=${order.accessKey}`;
  const adminUrl = `${origin}/admin/commandes/${order.id}`;
  const content = `
    <p style="color:#b8b8b8;font-size:14px;line-height:1.6;margin:0 0 14px;">
      Une nouvelle commande vient d'arriver. Le client peut démarrer son brief — vous serez notifié dans l'espace admin.
    </p>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Commande', `<strong>${esc(order.id)}</strong>`)}
      ${row('Client', esc(`${order.client.firstName} ${order.client.lastName}`))}
      ${row('Téléphone', esc(order.client.phone))}
      ${row('E-mail', esc(order.client.email))}
      ${row('Projet', order.type === 'agent' ? '🤖 Agent IA' : '🌐 Site web')}
      ${row('Offre', `<strong style="color:#f20d25;">${esc(plan.name || order.planSlug)} — ${plan.from ? 'dès ' : ''}${plan.price} € ${esc(plan.unit || '')}</strong>`)}
      ${row('Échéance souhaitée', esc(new Date(order.desiredDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })))}
      ${order.comment ? row('Note du client', esc(order.comment)) : ''}
    </table>
    ${button(adminUrl, 'Ouvrir la commande dans l’admin')}
    <p style="color:#8a8a8c;font-size:12px;text-align:center;">Lien de brief du client (à lui transférer si besoin) :<br><a href="${chatUrl}" style="color:#f20d25;word-break:break-all;">${chatUrl}</a></p>`;
  return sendMail({
    to,
    subject: `🛒 Nouvelle commande ${order.id} — ${plan.name} (${plan.from ? 'dès ' : ''}${plan.price} €${plan.mode === 'monthly' ? '/mois' : ''})`,
    html: layout('Nouvelle commande reçue', content),
    text: `Nouvelle commande ${order.id}\nClient : ${order.client.firstName} ${order.client.lastName} — ${order.client.phone} — ${order.client.email}\nOffre : ${plan.name} (${plan.from ? 'dès ' : ''}${plan.price} €)\nAdmin : ${adminUrl}\nBrief client : ${chatUrl}`,
  });
}

export function notifyAdminBriefDone(order, origin) {
  const plan = PLANS[order.planSlug] || {};
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  const adminUrl = `${origin}/admin/commandes/${order.id}`;
  const c = order.brief?.compat;
  const verdict = c ? (c.verdict === 'compatible' ? '✓ Compatible' : c.verdict === 'ajustements' ? '⚠ Ajustements à prévoir' : '✕ Partiellement hors périmètre') : '—';
  const content = `
    <p style="color:#b8b8b8;font-size:14px;line-height:1.6;margin:0 0 14px;">
      Le brief de <strong style="color:#fff;">${esc(order.client.firstName)} ${esc(order.client.lastName)}</strong> est terminé et vous attend pour étude.
    </p>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Commande', `<strong>${esc(order.id)}</strong>`)}
      ${row('Offre', `${esc(plan.name || order.planSlug)} — ${plan.from ? 'dès ' : ''}${plan.price} € ${esc(plan.unit || '')}`)}
      ${row('Compatibilité', verdict)}
    </table>
    ${button(adminUrl, 'Étudier le brief')}`;
  return sendMail({
    to,
    subject: `📋 Brief terminé — ${order.id} (${verdict.replace(/[✓⚠✕]/g, '').trim()})`,
    html: layout('Brief client terminé', content),
  });
}

export function notifyAdminNewMessage(msg, origin) {
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  const content = `
    <table style="width:100%;border-collapse:collapse;">
      ${row('De', `<strong>${esc(msg.name)}</strong>${msg.company ? ' — ' + esc(msg.company) : ''}`)}
      ${row('E-mail', esc(msg.email))}
      ${row('Type de projet', esc(msg.projectType))}
      ${msg.budget ? row('Budget', esc(msg.budget)) : ''}
    </table>
    <div style="background:#111112;border:1px solid #262628;border-radius:10px;padding:14px 16px;margin-top:14px;">
      <p style="color:#e8e8e9;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">${esc(msg.message)}</p>
    </div>
    ${button(`${origin}/admin`, 'Voir dans l’admin')}`;
  return sendMail({
    to,
    subject: `✉️ Nouveau message — ${msg.name} (${msg.projectType})`,
    html: layout('Nouveau message de contact', content),
  });
}

/* ----------------------------------------------------- e-mails au CLIENT */
export function confirmOrderToClient(order, origin) {
  const plan = PLANS[order.planSlug] || {};
  const chatUrl = `${origin}/chat/${order.id}?key=${order.accessKey}`;
  const content = `
    <p style="color:#b8b8b8;font-size:14px;line-height:1.6;margin:0 0 14px;">
      Bonjour ${esc(order.client.firstName)},<br><br>
      Votre commande <strong style="color:#fff;">${esc(order.id)}</strong> (${esc(plan.name)} — ${plan.from ? 'dès ' : ''}${plan.price} € ${esc(plan.unit || '')})
      est bien enregistrée. Prochaine étape : décrivez votre projet à notre assistant de brief, qui vérifiera
      sa compatibilité avec votre offre avant que notre équipe ne prenne le relais.
    </p>
    ${button(chatUrl, 'Démarrer / continuer mon brief')}
    <p style="color:#8a8a8c;font-size:12px;line-height:1.6;text-align:center;">
      Ce lien est personnel et privé : conservez cet e-mail, il vous permet de retrouver votre brief
      et de suivre votre commande (statut, livraison).<br>
      Échéance souhaitée : ${esc(new Date(order.desiredDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }))}.
    </p>`;
  return sendMail({
    to: order.client.email,
    subject: `DigitalVerse — votre commande ${order.id} est bien reçue ✓`,
    html: layout('Votre commande est confirmée', content),
    text: `Bonjour ${order.client.firstName}, votre commande ${order.id} (${plan.name}) est bien enregistrée. Poursuivez votre briefing ici : ${chatUrl} (lien privé, à conserver).`,
  });
}

export function ackContactToClient(msg) {
  const content = `
    <p style="color:#b8b8b8;font-size:14px;line-height:1.6;margin:0;">
      Bonjour ${esc(msg.name)},<br><br>
      Nous avons bien reçu votre message concernant « ${esc(msg.projectType)} ».
      Nous l'étudions et revenons vers vous rapidement à cette adresse.
    </p>`;
  return sendMail({
    to: msg.email,
    subject: 'DigitalVerse — votre demande a bien été reçue ✓',
    html: layout('Message bien reçu', content),
  });
}
