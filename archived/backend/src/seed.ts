import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('Starting database seed...');

  try {
    // Create a default tenant
    const tenantId = uuidv4();
    await dataSource.query(`
      INSERT INTO tenants (id, name, slug, settings, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [tenantId, 'Demo Company', 'demo-company', JSON.stringify({ theme: 'light', language: 'en' })]);
    console.log('Created tenant');

    // Create departments
    const departments = [
      { id: uuidv4(), name: 'Engineering', description: 'Software development and technical operations' },
      { id: uuidv4(), name: 'Human Resources', description: 'People management and recruitment' },
      { id: uuidv4(), name: 'Sales', description: 'Revenue generation and client relationships' },
      { id: uuidv4(), name: 'Marketing', description: 'Brand awareness and lead generation' },
      { id: uuidv4(), name: 'Finance', description: 'Financial planning and accounting' },
    ];

    for (const dept of departments) {
      await dataSource.query(`
        INSERT INTO departments (id, name, description, settings, "isActive", "tenantId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, true, $5, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [dept.id, dept.name, dept.description, JSON.stringify({}), tenantId]);
    }
    console.log('Created departments');

    // Create positions
    const positions = [
      { id: uuidv4(), title: 'Software Engineer', departmentId: departments[0].id, baseSalary: 85000 },
      { id: uuidv4(), title: 'Senior Software Engineer', departmentId: departments[0].id, baseSalary: 120000 },
      { id: uuidv4(), title: 'Engineering Manager', departmentId: departments[0].id, baseSalary: 150000 },
      { id: uuidv4(), title: 'HR Specialist', departmentId: departments[1].id, baseSalary: 55000 },
      { id: uuidv4(), title: 'HR Manager', departmentId: departments[1].id, baseSalary: 85000 },
      { id: uuidv4(), title: 'Sales Representative', departmentId: departments[2].id, baseSalary: 50000 },
      { id: uuidv4(), title: 'Sales Manager', departmentId: departments[2].id, baseSalary: 90000 },
      { id: uuidv4(), title: 'Marketing Specialist', departmentId: departments[3].id, baseSalary: 60000 },
      { id: uuidv4(), title: 'Financial Analyst', departmentId: departments[4].id, baseSalary: 75000 },
    ];

    for (const pos of positions) {
      await dataSource.query(`
        INSERT INTO positions (id, title, description, "baseSalary", requirements, responsibilities, "isActive", "tenantId", "departmentId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [pos.id, pos.title, `${pos.title} position`, pos.baseSalary, JSON.stringify({}), JSON.stringify({}), tenantId, pos.departmentId]);
    }
    console.log('Created positions');

    // Create employees
    const employees = [
      { firstName: 'John', lastName: 'Smith', employeeId: 'EMP001', deptIdx: 0, posIdx: 2 },
      { firstName: 'Sarah', lastName: 'Johnson', employeeId: 'EMP002', deptIdx: 0, posIdx: 1 },
      { firstName: 'Michael', lastName: 'Williams', employeeId: 'EMP003', deptIdx: 0, posIdx: 0 },
      { firstName: 'Emily', lastName: 'Brown', employeeId: 'EMP004', deptIdx: 0, posIdx: 0 },
      { firstName: 'David', lastName: 'Jones', employeeId: 'EMP005', deptIdx: 1, posIdx: 4 },
      { firstName: 'Jennifer', lastName: 'Davis', employeeId: 'EMP006', deptIdx: 1, posIdx: 3 },
      { firstName: 'Robert', lastName: 'Miller', employeeId: 'EMP007', deptIdx: 2, posIdx: 6 },
      { firstName: 'Lisa', lastName: 'Wilson', employeeId: 'EMP008', deptIdx: 2, posIdx: 5 },
      { firstName: 'James', lastName: 'Moore', employeeId: 'EMP009', deptIdx: 2, posIdx: 5 },
      { firstName: 'Amanda', lastName: 'Taylor', employeeId: 'EMP010', deptIdx: 3, posIdx: 7 },
      { firstName: 'Christopher', lastName: 'Anderson', employeeId: 'EMP011', deptIdx: 4, posIdx: 8 },
      { firstName: 'Jessica', lastName: 'Thomas', employeeId: 'EMP012', deptIdx: 0, posIdx: 0 },
    ];

    const employeeIds: string[] = [];
    for (const emp of employees) {
      const empId = uuidv4();
      employeeIds.push(empId);
      const dob = new Date(1985 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const hireDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

      await dataSource.query(`
        INSERT INTO employees (id, "firstName", "lastName", "employeeId", "dateOfBirth", "hireDate", "phoneNumber", address, "emergencyContact", documents, "isActive", "departmentId", "positionId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, $11, $12, NOW(), NOW())
        ON CONFLICT ("employeeId") DO NOTHING
      `, [
        empId,
        emp.firstName,
        emp.lastName,
        emp.employeeId,
        dob.toISOString().split('T')[0],
        hireDate.toISOString().split('T')[0],
        `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        `${Math.floor(Math.random() * 9999) + 1} Main St, City, State`,
        `Emergency Contact: ${Math.floor(Math.random() * 10000000000)}`,
        JSON.stringify({}),
        departments[emp.deptIdx].id,
        positions[emp.posIdx].id
      ]);
    }
    console.log('Created employees');

    // Create leaves
    const leaveTypes = ['ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY', 'PATERNITY'];
    const leaveStatuses = ['PENDING', 'APPROVED', 'REJECTED'];

    for (let i = 0; i < 8; i++) {
      const empIdx = Math.floor(Math.random() * employeeIds.length);
      const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);

      await dataSource.query(`
        INSERT INTO leaves (id, type, "startDate", "endDate", duration, reason, status, attachments, "employeeId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [
        uuidv4(),
        leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
        'Personal time off request',
        leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)],
        JSON.stringify({}),
        employeeIds[empIdx]
      ]);
    }
    console.log('Created leaves');

    // Create payrolls
    const payrollStatuses = ['PENDING', 'PROCESSING', 'COMPLETED'];

    for (let month = 0; month < 3; month++) {
      for (const empId of employeeIds.slice(0, 8)) {
        const baseSalary = 4000 + Math.floor(Math.random() * 8000);
        const overtime = Math.floor(Math.random() * 500);
        const bonuses = Math.floor(Math.random() * 1000);
        const deductions = Math.floor(Math.random() * 800);

        await dataSource.query(`
          INSERT INTO payrolls (id, "payPeriodStart", "payPeriodEnd", "baseSalary", overtime, bonuses, deductions, "netSalary", status, details, "taxInfo", benefits, "employeeId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [
          uuidv4(),
          new Date(2024, 9 + month, 1).toISOString().split('T')[0],
          new Date(2024, 9 + month + 1, 0).toISOString().split('T')[0],
          baseSalary,
          overtime,
          bonuses,
          deductions,
          baseSalary + overtime + bonuses - deductions,
          payrollStatuses[Math.min(month, 2)],
          JSON.stringify({}),
          JSON.stringify({ federalTax: deductions * 0.6, stateTax: deductions * 0.4 }),
          JSON.stringify({ health: 200, dental: 50 }),
          empId
        ]);
      }
    }
    console.log('Created payrolls');

    // Create CRM customers
    const customers = [
      { name: 'Acme Corporation', type: 'company', status: 'customer', email: 'contact@acme.com' },
      { name: 'TechStart Inc', type: 'company', status: 'customer', email: 'info@techstart.io' },
      { name: 'Global Solutions Ltd', type: 'company', status: 'prospect', email: 'sales@globalsolutions.com' },
      { name: 'Innovation Labs', type: 'company', status: 'lead', email: 'hello@innovationlabs.co' },
      { name: 'Enterprise Systems', type: 'company', status: 'customer', email: 'contact@enterprise-sys.com' },
      { name: 'Digital Ventures', type: 'company', status: 'prospect', email: 'info@digitalventures.io' },
    ];

    const customerIds: string[] = [];
    for (const cust of customers) {
      const custId = uuidv4();
      customerIds.push(custId);

      await dataSource.query(`
        INSERT INTO customers (id, name, type, status, email, phone, address, "companyDetails", "contactDetails", "lifetimeValue", tags, notes, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [
        custId,
        cust.name,
        cust.type,
        cust.status,
        cust.email,
        `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        `${Math.floor(Math.random() * 999) + 1} Business Ave, Suite ${Math.floor(Math.random() * 500) + 1}`,
        JSON.stringify({ industry: 'Technology', size: '50-200' }),
        JSON.stringify({ website: `https://${cust.name.toLowerCase().replace(/\s+/g, '')}.com` }),
        Math.floor(Math.random() * 100000),
        JSON.stringify(['enterprise', 'tech']),
        'Key account'
      ]);
    }
    console.log('Created customers');

    // Create contacts
    const contactNames = [
      { firstName: 'Alice', lastName: 'Cooper', title: 'CEO' },
      { firstName: 'Bob', lastName: 'Martinez', title: 'CTO' },
      { firstName: 'Carol', lastName: 'White', title: 'VP Sales' },
      { firstName: 'Daniel', lastName: 'Lee', title: 'Product Manager' },
      { firstName: 'Eva', lastName: 'Garcia', title: 'Engineering Director' },
      { firstName: 'Frank', lastName: 'Robinson', title: 'CFO' },
    ];

    for (let i = 0; i < contactNames.length; i++) {
      const contact = contactNames[i];
      const custIdx = i % customerIds.length;

      await dataSource.query(`
        INSERT INTO contacts (id, "firstName", "lastName", title, department, email, phone, mobile, "socialProfiles", "isPrimary", preferences, notes, tags, "lastContactDate", "customerId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [
        uuidv4(),
        contact.firstName,
        contact.lastName,
        contact.title,
        'Executive',
        `${contact.firstName.toLowerCase()}.${contact.lastName.toLowerCase()}@company.com`,
        `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        JSON.stringify({ linkedin: `https://linkedin.com/in/${contact.firstName.toLowerCase()}${contact.lastName.toLowerCase()}` }),
        i % 2 === 0,
        JSON.stringify({ communicationChannel: 'email', newsletter: true }),
        'Key decision maker',
        JSON.stringify(['decision-maker', 'executive']),
        new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        customerIds[custIdx]
      ]);
    }
    console.log('Created contacts');

    // Create opportunities
    const opportunityStages = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];

    for (let i = 0; i < 8; i++) {
      const custIdx = Math.floor(Math.random() * customerIds.length);
      const stage = opportunityStages[Math.floor(Math.random() * opportunityStages.length)];

      await dataSource.query(`
        INSERT INTO opportunities (id, title, description, value, currency, stage, probability, "expectedCloseDate", "actualCloseDate", notes, tags, "customerId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [
        uuidv4(),
        `Enterprise Deal ${i + 1}`,
        'Enterprise software implementation project',
        10000 + Math.floor(Math.random() * 90000),
        'USD',
        stage,
        stage === 'CLOSED_WON' ? 100 : stage === 'CLOSED_LOST' ? 0 : Math.floor(Math.random() * 80) + 10,
        new Date(2024, 11 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        stage.startsWith('CLOSED') ? new Date().toISOString().split('T')[0] : null,
        'High priority deal',
        JSON.stringify(['enterprise', 'q4']),
        customerIds[custIdx]
      ]);
    }
    console.log('Created opportunities');

    // Create CRM activities
    const activityTypes = ['CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK'];

    for (let i = 0; i < 15; i++) {
      const custIdx = Math.floor(Math.random() * customerIds.length);
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];

      await dataSource.query(`
        INSERT INTO activities (id, type, subject, description, "scheduledAt", "completedAt", duration, outcome, notes, "customerId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [
        uuidv4(),
        activityType,
        `${activityType.charAt(0) + activityType.slice(1).toLowerCase()} with customer`,
        `Scheduled ${activityType.toLowerCase()} regarding ongoing project`,
        new Date(2024, 10 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 28) + 1).toISOString(),
        Math.random() > 0.5 ? new Date().toISOString() : null,
        30 + Math.floor(Math.random() * 60),
        Math.random() > 0.5 ? 'Positive discussion' : null,
        'Follow up required',
        customerIds[custIdx]
      ]);
    }
    console.log('Created activities');

    // Create Codeforge codebases
    const codebases = [
      { name: 'Main Platform', description: 'Core platform monorepo' },
      { name: 'Mobile App', description: 'React Native mobile application' },
      { name: 'API Gateway', description: 'Microservices API gateway' },
    ];

    const codebaseIds: string[] = [];
    for (const cb of codebases) {
      const cbId = uuidv4();
      codebaseIds.push(cbId);

      await dataSource.query(`
        INSERT INTO codeforge_codebases (id, name, description, status, metadata, settings, "tenantId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [
        cbId,
        cb.name,
        cb.description,
        'ready',
        JSON.stringify({ totalFiles: Math.floor(Math.random() * 1000) + 100, totalLines: Math.floor(Math.random() * 50000) + 5000, languages: { TypeScript: 60, JavaScript: 25, CSS: 15 } }),
        JSON.stringify({ autoAnalyze: true, analysisDepth: 'standard' }),
        tenantId
      ]);
    }
    console.log('Created codebases');

    // Create repositories
    for (let i = 0; i < codebaseIds.length; i++) {
      const repos = [
        { name: 'frontend', remoteUrl: 'https://github.com/company/frontend' },
        { name: 'backend', remoteUrl: 'https://github.com/company/backend' },
      ];

      for (const repo of repos) {
        await dataSource.query(`
          INSERT INTO codeforge_repositories (id, name, "remoteUrl", provider, status, branch, "localPath", metadata, "codebaseId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [
          uuidv4(),
          `${codebases[i].name.toLowerCase().replace(/\s+/g, '-')}-${repo.name}`,
          repo.remoteUrl,
          'github',
          'ready',
          'main',
          `/repos/${codebases[i].name.toLowerCase().replace(/\s+/g, '-')}/${repo.name}`,
          JSON.stringify({ lastCommit: 'abc123', stars: Math.floor(Math.random() * 100) }),
          codebaseIds[i]
        ]);
      }
    }
    console.log('Created repositories');

    // Create playbooks
    const playbooks = [
      { name: 'Security Hardening', category: 'SECURITY', description: 'Apply security best practices' },
      { name: 'Performance Optimization', category: 'COST_OPTIMIZATION', description: 'Optimize code performance' },
      { name: 'Code Consolidation', category: 'CONSOLIDATION', description: 'Reduce code duplication' },
      { name: 'Dependency Updates', category: 'DEVELOPER_EXPERIENCE', description: 'Update project dependencies' },
      { name: 'Compliance Check', category: 'COMPLIANCE', description: 'Ensure regulatory compliance' },
    ];

    for (const pb of playbooks) {
      await dataSource.query(`
        INSERT INTO codeforge_playbooks (id, name, description, category, version, steps, "isBuiltIn", "isActive", "tenantId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [
        uuidv4(),
        pb.name,
        pb.description,
        pb.category,
        '1.0.0',
        JSON.stringify([{ name: 'Analyze', order: 1 }, { name: 'Transform', order: 2 }, { name: 'Validate', order: 3 }]),
        true,
        true,
        tenantId
      ]);
    }
    console.log('Created playbooks');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed();
