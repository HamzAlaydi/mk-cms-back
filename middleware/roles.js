// Role-based access control helpers

// Allow only super admins to proceed
const allowSuperAdminsOnly = (req, res, next) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    const superAdmins = new Set([
      'hamza.alaydi.99@outlook.sa',
      'superadmin@example.com',
    ]);

    if (superAdmins.has((admin.email || '').toLowerCase()) || admin.role === 'super_admin') {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden: super admin only' });
  } catch (e) {
    return res.status(403).json({ error: 'Forbidden' });
  }
};

// Allow all authenticated admins to create/update/read, but only super admins can delete
const allowAllButRestrictDelete = (req, res, next) => {
  try {
    // Only enforce for DELETE requests
    if (req.method !== 'DELETE') return next();

    const admin = req.admin;
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    const superAdmins = new Set([
      'hamza.alaydi.99@outlook.sa',
      'superadmin@example.com',
    ]);

    if (superAdmins.has((admin.email || '').toLowerCase()) || admin.role === 'super_admin') {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden: only super admins can delete' });
  } catch (e) {
    return res.status(403).json({ error: 'Forbidden' });
  }
};

module.exports = { allowSuperAdminsOnly, allowAllButRestrictDelete };


