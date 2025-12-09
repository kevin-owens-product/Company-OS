import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async seed(): Promise<{ success: boolean; message: string }> {
    try {
      // Create a default tenant (using 'domain' column, not 'slug')
      const tenantId = uuidv4();
      await this.dataSource.query(`
        INSERT INTO tenants (id, name, domain, settings, "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, true, NOW(), NOW())
        ON CONFLICT (domain) DO UPDATE SET "updatedAt" = NOW() RETURNING id
      `, [tenantId, 'Demo Company', 'demo-company.com', JSON.stringify({ theme: 'light', language: 'en' })]);

      // Get the actual tenant ID (in case it already existed)
      const tenantResult = await this.dataSource.query(`SELECT id FROM tenants WHERE domain = 'demo-company.com'`);
      const actualTenantId = tenantResult[0]?.id || tenantId;

      // Create roles
      const adminRoleId = uuidv4();
      const userRoleId = uuidv4();

      await this.dataSource.query(`
        INSERT INTO roles (id, name, permissions, description, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT (name) DO UPDATE SET "updatedAt" = NOW() RETURNING id
      `, [adminRoleId, 'admin', JSON.stringify(['*']), 'Full system administrator']);

      await this.dataSource.query(`
        INSERT INTO roles (id, name, permissions, description, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT (name) DO UPDATE SET "updatedAt" = NOW() RETURNING id
      `, [userRoleId, 'user', JSON.stringify(['read', 'write']), 'Standard user']);

      // Get actual role IDs
      const adminRoleResult = await this.dataSource.query(`SELECT id FROM roles WHERE name = 'admin'`);
      const userRoleResult = await this.dataSource.query(`SELECT id FROM roles WHERE name = 'user'`);
      const actualAdminRoleId = adminRoleResult[0]?.id || adminRoleId;
      const actualUserRoleId = userRoleResult[0]?.id || userRoleId;

      // Create demo users with bcrypt-hashed passwords
      // Demo credentials: admin@demo.com / demo123, user@demo.com / demo123
      const hashedPassword = await bcrypt.hash('demo123', 10);

      const demoUsers = [
        { firstName: 'Admin', lastName: 'User', email: 'admin@demo.com', roleId: actualAdminRoleId },
        { firstName: 'Demo', lastName: 'User', email: 'user@demo.com', roleId: actualUserRoleId },
      ];

      for (const user of demoUsers) {
        await this.dataSource.query(`
          INSERT INTO users (id, "firstName", "lastName", email, password, "isActive", "tenantId", "roleId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, true, $6, $7, NOW(), NOW())
          ON CONFLICT (email) DO UPDATE SET password = $5, "updatedAt" = NOW()
        `, [uuidv4(), user.firstName, user.lastName, user.email, hashedPassword, actualTenantId, user.roleId]);
      }

      // Create departments
      const departments = [
        { id: uuidv4(), name: 'Engineering', description: 'Software development and technical operations' },
        { id: uuidv4(), name: 'Human Resources', description: 'People management and recruitment' },
        { id: uuidv4(), name: 'Sales', description: 'Revenue generation and client relationships' },
        { id: uuidv4(), name: 'Marketing', description: 'Brand awareness and lead generation' },
        { id: uuidv4(), name: 'Finance', description: 'Financial planning and accounting' },
      ];

      for (const dept of departments) {
        await this.dataSource.query(`
          INSERT INTO departments (id, name, description, settings, "isActive", "tenantId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, true, $5, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [dept.id, dept.name, dept.description, JSON.stringify({}), actualTenantId]);
      }

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
        await this.dataSource.query(`
          INSERT INTO positions (id, title, description, "baseSalary", requirements, responsibilities, "isActive", "tenantId", "departmentId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [pos.id, pos.title, `${pos.title} position`, pos.baseSalary, JSON.stringify({}), JSON.stringify({}), actualTenantId, pos.departmentId]);
      }

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

        await this.dataSource.query(`
          INSERT INTO employees (id, "firstName", "lastName", "employeeId", "dateOfBirth", "hireDate", "phoneNumber", address, "emergencyContact", documents, "isActive", "departmentId", "positionId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, $11, $12, NOW(), NOW())
          ON CONFLICT ("employeeId") DO UPDATE SET "updatedAt" = NOW() RETURNING id
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

      // Get actual employee IDs
      const empResult = await this.dataSource.query(`SELECT id FROM employees LIMIT 12`);
      const actualEmployeeIds = empResult.map((e: any) => e.id);

      // Create leaves (using lowercase enum values per entity definition)
      const leaveTypes = ['annual', 'sick', 'maternity', 'paternity', 'bereavement', 'unpaid'];
      const leaveStatuses = ['pending', 'approved', 'rejected', 'cancelled'];

      for (let i = 0; i < 8; i++) {
        const empIdx = Math.floor(Math.random() * Math.min(actualEmployeeIds.length, 8));
        const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);

        if (actualEmployeeIds[empIdx]) {
          await this.dataSource.query(`
            INSERT INTO leaves (id, type, "startDate", "endDate", duration, reason, status, attachments, approvals, "employeeId", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
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
            JSON.stringify({}),
            actualEmployeeIds[empIdx]
          ]);
        }
      }

      // Create payrolls (using lowercase enum values)
      const payrollStatuses = ['pending', 'processing', 'completed'];

      for (let month = 0; month < 3; month++) {
        for (let i = 0; i < Math.min(actualEmployeeIds.length, 8); i++) {
          const baseSalary = 4000 + Math.floor(Math.random() * 8000);
          const overtime = Math.floor(Math.random() * 500);
          const bonuses = Math.floor(Math.random() * 1000);
          const deductions = Math.floor(Math.random() * 800);

          if (actualEmployeeIds[i]) {
            await this.dataSource.query(`
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
              actualEmployeeIds[i]
            ]);
          }
        }
      }

      // Create CRM customers (using lowercase enum values)
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

        await this.dataSource.query(`
          INSERT INTO customers (id, name, type, status, email, phone, address, "companyDetails", "contactDetails", "lifetimeValue", tags, notes, "tenantId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
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
          'Key account',
          actualTenantId
        ]);
      }

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

        await this.dataSource.query(`
          INSERT INTO contacts (id, "firstName", "lastName", title, department, email, phone, mobile, "socialProfiles", "isPrimary", preferences, notes, tags, "lastContactDate", "customerId", "tenantId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
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
          customerIds[custIdx],
          actualTenantId
        ]);
      }

      // Create opportunities (using correct schema with lowercase enum values)
      const opportunityStages = ['qualification', 'needs_analysis', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
      const opportunityPriorities = ['low', 'medium', 'high'];

      for (let i = 0; i < 8; i++) {
        const custIdx = Math.floor(Math.random() * customerIds.length);
        const stage = opportunityStages[Math.floor(Math.random() * opportunityStages.length)];
        const probability = stage === 'closed_won' ? 1.00 : stage === 'closed_lost' ? 0.00 : (Math.floor(Math.random() * 80) + 10) / 100;

        await this.dataSource.query(`
          INSERT INTO opportunities (id, title, description, value, probability, stage, priority, "expectedCloseDate", products, "customFields", notes, "customerId", "tenantId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [
          uuidv4(),
          `Enterprise Deal ${i + 1}`,
          'Enterprise software implementation project',
          10000 + Math.floor(Math.random() * 90000),
          probability,
          stage,
          opportunityPriorities[Math.floor(Math.random() * opportunityPriorities.length)],
          new Date(2024, 11 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          JSON.stringify([]),
          JSON.stringify({}),
          'High priority deal',
          customerIds[custIdx],
          actualTenantId
        ]);
      }

      // Create CRM activities (using correct schema with lowercase enum values)
      const activityTypes = ['call', 'email', 'meeting', 'task', 'note', 'follow_up'];
      const activityStatuses = ['planned', 'in_progress', 'completed', 'cancelled'];
      const activityPriorities = ['low', 'medium', 'high'];

      for (let i = 0; i < 15; i++) {
        const custIdx = Math.floor(Math.random() * customerIds.length);
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const status = activityStatuses[Math.floor(Math.random() * activityStatuses.length)];

        await this.dataSource.query(`
          INSERT INTO activities (id, type, subject, description, "scheduledAt", "completedAt", status, priority, duration, outcome, location, notes, "customerId", "tenantId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [
          uuidv4(),
          activityType,
          `${activityType.charAt(0).toUpperCase() + activityType.slice(1).replace('_', ' ')} with customer`,
          `Scheduled ${activityType.replace('_', ' ')} regarding ongoing project`,
          new Date(2024, 10 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 28) + 1).toISOString(),
          status === 'completed' ? new Date().toISOString() : null,
          status,
          activityPriorities[Math.floor(Math.random() * activityPriorities.length)],
          `${30 + Math.floor(Math.random() * 60)} minutes`,
          status === 'completed' ? JSON.stringify({ result: 'Positive discussion', nextSteps: 'Follow up next week' }) : null,
          JSON.stringify({ type: 'virtual', link: 'https://meet.example.com/room' }),
          'Follow up required',
          customerIds[custIdx],
          actualTenantId
        ]);
      }

      // Create Codeforge codebases (using lowercase enum values)
      const codebases = [
        { name: 'Main Platform', description: 'Core platform monorepo' },
        { name: 'Mobile App', description: 'React Native mobile application' },
        { name: 'API Gateway', description: 'Microservices API gateway' },
      ];

      const codebaseIds: string[] = [];
      for (const cb of codebases) {
        const cbId = uuidv4();
        codebaseIds.push(cbId);

        await this.dataSource.query(`
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
          actualTenantId
        ]);
      }

      // Create repositories (using correct schema)
      for (let i = 0; i < codebaseIds.length; i++) {
        const repos = [
          { name: 'frontend', remoteUrl: 'https://github.com/company/frontend' },
          { name: 'backend', remoteUrl: 'https://github.com/company/backend' },
        ];

        for (const repo of repos) {
          await this.dataSource.query(`
            INSERT INTO codeforge_repositories (id, name, description, "remoteUrl", provider, status, branch, metadata, "analysisConfig", "codebaseId", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
            ON CONFLICT (id) DO NOTHING
          `, [
            uuidv4(),
            `${codebases[i].name.toLowerCase().replace(/\s+/g, '-')}-${repo.name}`,
            `${repo.name} repository for ${codebases[i].name}`,
            repo.remoteUrl,
            'github',
            'ready',
            'main',
            JSON.stringify({ lastCommit: 'abc123', stars: Math.floor(Math.random() * 100) }),
            JSON.stringify({ excludePatterns: ['node_modules', '.git'] }),
            codebaseIds[i]
          ]);
        }
      }

      // Create playbooks (using correct schema with code, status enum, rules)
      const playbooks = [
        { code: 'PB-201', name: 'Security Hardening', category: 'security', description: 'Apply security best practices' },
        { code: 'PB-301', name: 'Performance Optimization', category: 'cost_optimization', description: 'Optimize code performance' },
        { code: 'PB-101', name: 'Code Consolidation', category: 'consolidation', description: 'Reduce code duplication' },
        { code: 'PB-401', name: 'Dependency Updates', category: 'developer_experience', description: 'Update project dependencies' },
        { code: 'PB-501', name: 'Compliance Check', category: 'compliance', description: 'Ensure regulatory compliance' },
      ];

      for (const pb of playbooks) {
        await this.dataSource.query(`
          INSERT INTO codeforge_playbooks (id, code, name, description, category, status, version, "isBuiltIn", config, rules, "oversightConfig", metrics, "tenantId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [
          uuidv4(),
          pb.code,
          pb.name,
          pb.description,
          pb.category,
          'active',
          '1.0.0',
          true,
          JSON.stringify({ targetLanguages: ['TypeScript', 'JavaScript'], estimatedEffort: '2-4 hours', riskLevel: 'low' }),
          JSON.stringify([
            { id: uuidv4(), name: 'Analyze', description: 'Analyze codebase', pattern: '**/*.ts', action: 'flag', autoFix: false, priority: 1 },
            { id: uuidv4(), name: 'Transform', description: 'Apply transformations', pattern: '**/*.ts', action: 'refactor', autoFix: true, priority: 2 },
          ]),
          JSON.stringify({ level: 'notify', approvalRequired: false, notifyOnExecution: true }),
          JSON.stringify({ timesExecuted: 0, successRate: 0, avgExecutionTime: 0, findingsResolved: 0 }),
          actualTenantId
        ]);
      }

      return { success: true, message: 'Database seeded successfully with demo data!' };
    } catch (error) {
      console.error('Seed error:', error);
      return { success: false, message: `Seeding failed: ${error.message}` };
    }
  }
}
